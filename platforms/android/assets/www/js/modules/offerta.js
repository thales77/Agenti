/**
 * Created by Babis Boikos on 02/04/2015.
 */
AGENTI.offerta = (function () {

    var offertaHeader = {totaleOfferta: 0, stato: "", note: "", headerID : null},
        offertaDetail = [],
        pdfFileName = 'offerta.pdf',
        pdfFilePath;

    // add a single item to the offerta table and update total
    var addItem = function (itemId, itemDesc, qty, prezzo, nota) {
        var totaleRiga = parseFloat(qty.replace(',', '.')) * parseFloat(prezzo.replace(',', '.'));

        //Better add some validation in the view instead of this shit
        if (isNaN(totaleRiga)) {
            totaleRiga = 0;
        }

        offertaDetail.push({
            itemId: itemId,
            itemDesc: itemDesc,
            qty: qty,
            prezzo: prezzo,
            totaleRiga: totaleRiga,
            nota: nota
        });

        offertaHeader.totaleOfferta = offertaHeader.totaleOfferta + totaleRiga; //summing the grand total of the offerta

    };

    //delete a single item from the dom table and from the model (offertaDetail), and update the offerta total in header.
    var deleteItem = function (item) {

        var tableRow = item.parents("tr"); //cache the current row on the dom
        var itemForDeletion = item.parents("tr").prevAll("tr").length; //get the number of rows before the row to be deleted, use this for splicing model array
        var totaleRiga = offertaDetail[itemForDeletion].totaleRiga;

        navigator.notification.confirm(
            "Cancellare articolo?",
            // callback
            function (buttonIndex) {
                if (buttonIndex === 1) {

                    tableRow.remove(); //remove table row from DOM
                    offertaDetail.splice(itemForDeletion, 1); //remove listino from model

                    //update totale in model
                    offertaHeader.totaleOfferta = offertaHeader.totaleOfferta - totaleRiga;

                    //DOM update total on the page
                    $('#totaleOfferta').text(offertaHeader.totaleOfferta.toFixed(2).replace(/\./g, ","));

                    //Disable buttons if the item table is empty
                    if (offertaDetail.length === 0) {
                        $('#newOffertaBtn').prop( "disabled", true );
                        $('#saveOfferta').prop( "disabled", true );
                        $('#inviaOfferta').prop( "disabled", true );
                        $('#offertaDeleteBtn').prop( "disabled", true );
                    }

                }
            },            // callback to invoke with index of button pressed
            'Attenzione',           // title
            ['Cancella articolo', 'Annulla']         // buttonLabels
        );

        event.preventDefault();
    };

    //Retrieve offerta list for the current client from sqlite DB
    var getOffertaList = function (client) {

        //initialise sqLite database
        var sqliteDb = AGENTI.sqliteDB;

        //execute sql
        sqliteDb.transaction(function (tx) {
            //select table
            tx.executeSql('SELECT * FROM Offerta_Header WHERE Client_ID LIKE \'%' + client + '%\' ORDER BY ID DESC', [], function (tx, res) {

                //render this to html instead of console
                var row = "",
                    html = "",
                    offertaList = $('#offertaList'),
                    statoString = "";


                for (var i = 0; i < res.rows.length; i++) {
                    row = res.rows.item(i);
                    if (row.Stato === "C") {
                        statoString = "Confermata";
                    } else {
                        statoString = "Offerta";
                    }
                    html = html + '<li data-headerID=' + row.ID + '><a href="#"><p>' + row.Data_inserimento + ' - Totale:  &#8364;' + row.Totale_Offerta.toFixed(2).replace(/\./g, ",") + " - " + statoString + '</p></a></li>';
                    offertaList.html(html);
                    offertaList.listview("refresh");
                    //console.log("row is " + JSON.stringify(row));
                }

            });

        });

    };

    //Retrieve offerta from sqlite DB
    var getOffertaDetail = function (headerID, callback) {
        if (!headerID) {
            return offertaDetail;
        } else {
            //initialise sqLite database
            var sqliteDb = AGENTI.sqliteDB;

            //get offerta header data
            sqliteDb.transaction(function (tx) {
                //select table
                tx.executeSql('SELECT * FROM Offerta_Header WHERE ID =' + headerID, [], function (tx, res) {

                    var row = "";

                    for (var i = 0; i < res.rows.length; i++) {
                        row = res.rows.item(i);
                        offertaHeader.headerID = row.ID;
                        offertaHeader.totaleOfferta = row.Totale_Offerta;
                        offertaHeader.stato = row.Stato;
                        offertaHeader.note = row.Note;
                    }
                });
            });

            //get offerta detail data
            sqliteDb.transaction(function (tx) {
                //select table
                tx.executeSql('SELECT * FROM Offerta_Detail WHERE Offerta_Header_ID =' + headerID, [], function (tx, res) {

                    var row = "";
                    //reset offertaDetail in case it is already populated
                    offertaDetail.length = 0;

                    for (var i = 0; i < res.rows.length; i++) {
                        row = res.rows.item(i);
                        offertaDetail.push({
                            itemId: row.Articolo_ID,
                            itemDesc: row.Articolo_Descr,
                            qty: row.Quantita,
                            prezzo: row.Prezzo,
                            totaleRiga: row.Totale_riga,
                            nota: row.Note
                        });
                    }
                    callback();
                });
            });
        }
    };

    //render offerta in GUI
    var renderOffertaDetail = function () {

        $('#offertaDetail').find('h5').text('Offerta a ' + AGENTI.client.ragSociale());

        $.each(offertaDetail, function () {
            $('#offertaTable tbody').append('<tr><td>' + this.itemId + '</td><td style=" font-weight: bold">' + this.itemDesc + '</td><td>' +
            this.qty.toString().replace(/\./g, ",") + '</td><td>' + '&#8364;' + this.prezzo.toString().replace(/\./g, ",") + '</td>><td>' + '&#8364;' + this.totaleRiga.toFixed(2).replace(/\./g, ",") + '</td><td>' +
            this.nota + '</td><td>' + '<button class="ui-btn ui-icon-delete ui-btn-icon-notext ui-corner-all ui-mini deleteOffertaDetailRow">Cancella</button></td></tr>');
        });

        if (offertaHeader.stato === 'C') {
            $('#offertaConfermedCheck').prop('checked', true).checkboxradio('refresh');
        } else {
            $('#offertaConfermedCheck').prop('checked', false).checkboxradio('refresh');
        }

        if (offertaDetail.length === 0) {
            $('#newOffertaBtn').prop( "disabled", true );
            $('#saveOfferta').prop( "disabled", true );
            $('#inviaOfferta').prop( "disabled", true );
            $('#offertaDeleteBtn').prop( "disabled", true );
        } else {
            $('#newOffertaBtn').prop( "disabled", false );
            $('#saveOfferta').prop( "disabled", false );
            $('#inviaOfferta').prop( "disabled", false );
            $('#offertaDeleteBtn').prop( "disabled", false );
        }

        $('#totaleOfferta').text(offertaHeader.totaleOfferta.toFixed(2).replace(/\./g, ","));
        $('#noteOffertaHeader').val(offertaHeader.note);
        $('#offertaTable').table("refresh");
    };

    //Clear Gui in offerta page and if deleteFromDb is set delete it from sqlite DB also
    var deleteCurrentOfferta = function (buttonIndex, deleteFromDb) {
        if (buttonIndex === 1) {

            if (deleteFromDb === true) {
                var sqliteDb = AGENTI.sqliteDB,
                    headerID = offertaHeader.headerID;
                sqliteDb.transaction(function (tx) {
                    //sql save offerta header
                    tx.executeSql("DELETE FROM Offerta_Header WHERE ID="+headerID);
                    tx.executeSql("DELETE FROM Offerta_Detail WHERE Offerta_Header_ID="+headerID);
                });
                navigator.notification.alert('Offerta cancellata');
            }

            offertaDetail.length = 0; //empty offerta detail array
            offertaHeader = {totaleOfferta: 0, stato: "", note: "", headerID : null}; //reset offerta total
            $('#totaleOfferta').text(offertaHeader.totaleOfferta.toFixed(2).replace(/\./g, ",")); //reset offerta total on DOM
            $('#offertaTable tbody').empty(); // empty table in offerta detail page
            $('#offertaConfermedCheck').attr("checked", false).checkboxradio("refresh");
            $('#noteOffertaHeader').val("");
            $('#newOffertaBtn').prop( "disabled", true );
            $('#saveOfferta').prop( "disabled", true );
            $('#inviaOfferta').prop( "disabled", true );
            $('#offertaDeleteBtn').prop( "disabled", true );


        }

    };

    //Salva offerta su sqliteDB
    var saveOfferta = function () {

        if (offertaDetail.length !== 0) {
            AGENTI.utils.vibrate(AGENTI.deviceType);
            navigator.notification.confirm(
                "Salva l'offerta nell' archivio?", // message

                //callback
                function (buttonIndex) {
                    if (buttonIndex === 1) {

                        //Salva l'offerta in localDB (sqlite plugin)
                        var promise = createOfferta();

                        promise.done(function () {
                            navigator.notification.alert('Offerta salvata');
                        });

                        promise.fail(function () {
                            navigator.notification.alert('Impossibile salvare l\'offerta');
                        });

                    }
                },
                'Salvataggio',           // title
                ['Si', 'Annulla']         // buttonLabels
            );
        }

    };

    //Invia l'offerta via email e salvala su sqliteDB
    var inviaOfferta = function () {

        if (offertaDetail.length !== 0) {
            AGENTI.utils.vibrate(AGENTI.deviceType);
            navigator.notification.confirm(
                "Inviare l'offerta e salvare nell' archivio?", // message

                //callback
                function (buttonIndex) {
                    if (buttonIndex === 1) {

                        //Salva l'offerta in localDB (sqlite plugin)
                        //Genera il file PDF usando la libreria jsPDF e invia il file via email come allegato, utilizzando email-composer.

                        var promise = createOfferta(createPDF);
                        //asynchronous call so using promise

                        promise.done(function () {
                            //cancella l'offerta dal GUI
                            deleteCurrentOfferta(1,false);
                        });

                        promise.fail(function () {
                            navigator.notification.alert('Impossibile inviare l\'offerta');
                        });

                    }
                },
                'Inviare offerta',           // title
                ['Invia', 'Annulla']         // buttonLabels
            );
        }

    };

    //Salva l'offerta in local sqlite db and call createpdf
    var createOfferta = function (callback) {

        var sqliteDb = AGENTI.sqliteDB,
            today = moment().format('DD/MM/YYYY'),
            deferred = $.Deferred();

        offertaHeader.note = $('#noteOffertaHeader').val();

        if ($('#offertaConfermedCheck').is(':checked')) {
            offertaHeader.stato = 'C';
        } else {
            offertaHeader.stato = 'O';
        }


        sqliteDb.transaction(function (tx) {
            //sql save offerta header
            tx.executeSql("DELETE FROM Offerta_Header WHERE ID="+offertaHeader.headerID);
            tx.executeSql("DELETE FROM Offerta_Detail WHERE Offerta_Header_ID="+offertaHeader.headerID);
        });

        sqliteDb.transaction(function (tx) {
            //sql save offerta header
            tx.executeSql("INSERT INTO Offerta_Header (Client_ID, Data_inserimento, Totale_Offerta, Stato, Note) VALUES (?,?,?,?,?)", [AGENTI.client.codice(), today, offertaHeader.totaleOfferta, offertaHeader.stato, offertaHeader.note],
                function (tx, res) {
                    //get the last inserted record's id fo insert in the offerta_Detail foreign key
                    offertaHeader.headerID = res.insertId;

                }, function (e) {
                    console.log("insert ERROR: " + e.message);
                });
        }, function () {
            deferred.reject("Transaction ERROR: " + e.message);
        }, function () {
            //Insert detail to db
            sqliteDb.transaction(function (tx) {
                //sql save offerta detail and execute callback
                $.each(offertaDetail, function () {
                    tx.executeSql("INSERT INTO Offerta_Detail (Offerta_Header_ID, Articolo_ID, Articolo_Descr, Quantita, Prezzo, Totale_riga, Note) VALUES (?,?,?,?,?,?,?)", [offertaHeader.headerID, this.itemId, this.itemDesc, this.qty, this.prezzo, this.totaleRiga, this.nota],
                        function (tx, res) {
                            //Do nothing
                        }, function (e) {
                            console.log("Detail insert ERROR: " + e.message);
                        });
                });
            }, function () {
                deferred.reject("Transaction ERROR: " + e.message);
            }, function () {
                deferred.resolve();
            });
        });

        //Generate email and pdf as attachment if required
        if (callback) {
            callback();
        }

        return deferred.promise();
    };

    //Genera il file PDF usando la libreria jsPDF
    var createPDF = function () {

        var tableData = [],
            columns = [],
            options = {},
            height = 180,
            splitText = "",
            noteHeight = 0;

        if (offertaDetail.length !== 0) {


            //FIRST GENERATE THE PDF DOCUMENT

            console.log("generating pdf...");
            var doc = new jsPDF('p', 'pt', 'a4');

            doc.setFontSize(20);
            doc.setFontType("bold");
            doc.text(20, 50, 'Sidercampania Professional srl');

            doc.setFontSize(12);
            doc.setFontType("normal");
            doc.text(20, 65, 'Offerta commerciale');
            doc.text(400, 65, 'Data emissione: ' + Date.today().toString("dd-MM-yyyy"));

            doc.setFontSize(10);
            doc.text(20, 80, 'Spett.le: ' + AGENTI.client.ragSociale());
            doc.text(20, 95, AGENTI.client.indirizzo());
            doc.text(20, 110, AGENTI.client.indirizzo2());

            options = {
                padding: 3, // Vertical cell padding
                fontSize: 10,
                lineHeight: 15,
                renderCell: function (x, y, w, h, txt, fillColor, options) {
                    doc.setFillColor.apply(this, fillColor);
                    doc.rect(x, y, w, h, 'F');
                    doc.text(txt, x + options.padding, y + doc.internal.getLineHeight());
                },
                margins: {horizontal: 20, top: 130, bottom: 40}, // How much space around the table
                extendWidth: true // If true, the table will span 100% of page width minus horizontal margins.
            };

            columns = [
                {title: "Codice", key: "codice"},
                {title: "Descrizione", key: "descrizione"},
                {title: "Note", key: "nota"},
                {title: "Qta", key: "qta"},
                {title: "Prezzo", key: "prezzo"},
                {title: "Totale", key: "totale"}
            ];


            $.each(offertaDetail, function () {

                tableData.push({
                    "codice": this.itemId,
                    "descrizione": this.itemDesc,
                    "nota": this.nota,
                    "qta": this.qty.toString().replace(/\./g, ","),
                    "prezzo": this.prezzo.toString().replace(/\./g, ","),
                    "totale": this.totaleRiga.toFixed(2).replace(/\./g, ",") //change into string again and replace dots with comas
                });
                height = height + 20;
            });

            doc.autoTable(columns, tableData, options);
            //height = doc.drawTable(tableData, {xstart:15,ystart:20,tablestart:50,marginleft:50, xOffset:5, yOffset:5});

            doc.setFontType("bolditalic");
            doc.setFontSize(12);
            doc.text(400, height, 'Totale offerta: ' + offertaHeader.totaleOfferta.toFixed(2).replace(/\./g, ",") + ' +IVA');

            doc.setFontType("normal");
            doc.setFontSize(10);
            doc.text(20, height + 20, 'Note aggiuntive: ');
            splitText = doc.splitTextToSize(offertaHeader.note, 550); //this text could be long so we have to split it in chunks
            doc.text(20, height + 35, splitText);

            noteHeight = splitText.length * 15; //push everything bellow the notes field down according to how many lines its is (lines*15pt)

            doc.setFontType("bolditalic");
            doc.setFontSize(10);
            doc.text(20, height + noteHeight + 70, 'La Sidercampania Professional srl non e\' responsabile per eventuali ritardi di consegna del materiale, dovuta ');
            doc.text(20, height + noteHeight + 85, 'ai nostri fornitori ed il loro ciclo di produzione e trasporto.');
            //doc.text(20, height + noteHeight + 110, 'Validita\' offerta 15gg');

            doc.setFontType("normal");
            doc.text(20, height + noteHeight + 125, 'Nominativo addetto: ' + AGENTI.db.getItem('full_name'));

            var pdfOutput = doc.output();
            //console.log(pdfOutput);

            function pdfSave(name, data, success, fail) {

                var gotFileSystem = function (fileSystem) {

                    pdfFilePath = fileSystem.root.nativeURL;

                    fileSystem.root.getFile(name, {create: true, exclusive: false}, gotFileEntry, fail);
                };

                var gotFileEntry = function (fileEntry) {
                    fileEntry.createWriter(gotFileWriter, fail);
                };

                var gotFileWriter = function (writer) {
                    writer.onwrite = success;
                    writer.onerror = fail;
                    writer.write(data);
                };

                window.requestFileSystem(window.LocalFileSystem.PERSISTENT, data.length || 0, gotFileSystem, fail);
            }

            //If pdf file successfully created send Email, else display error
            pdfSave(pdfFileName, pdfOutput, sendEmail, function (error) {
                // handle error
                console.log(error);
                navigator.notification.alert(error);
            });
        }
    };

    //Genera l'email usando il plugin email-composer
    var sendEmail = function () {

        var emailProperties = {
            to: AGENTI.client.email(),
            cc: [AGENTI.db.getItem('email')],
            subject: 'Offerta Sidercampania Professional srl',
            isHtml: true
        };

        // success! - generate email body
        emailProperties.body = Date.today().toString("dd-MM-yyyy") + '<h3>Spettabile cliente ' + AGENTI.client.ragSociale() + '</h3>' +
        '<p>A seguito Vs. richiesta inviamo in allegato la ns. migliore offerta relativa agli articoli specificati.<br>' +
        'Attendiamo Vs. conferma per procedere con l&apos;evasione dell&apos;ordine.</p>' +
        '<p>Distini saluti,<br>' + AGENTI.db.getItem('full_name') + '<br>Sidercampania Professional srl<br>' +
        'tel. 0817580177<br>Fax 0815405590</p>';


        emailProperties.attachments = pdfFilePath + pdfFileName;

        //if offerta is definitiva add the 'vendite' email to the cc array of emaiProperties
        if ($('#offertaConfermedCheck').is(':checked')) {
            emailProperties.cc.push('vendite@siderprofessional.com');
        }

        //check if the email sending has been cancelled by the user
        cordova.plugins.email.open(emailProperties, function () {
            //navigator.notification.alert('invio annullato'); //fix this, it always executes his part
        }, this);
    };

    //Controlla se un'offerta e stata inserita e se si, chiedi l'utente se la vuola cancellare
    var checkIsInserted = function (e) {
        if (offertaDetail.length !== 0) {
            AGENTI.utils.vibrate(AGENTI.deviceType);
            navigator.notification.confirm(
                "C'è un' offerta in fase di modifica, la vuoi abbandonare?", // message
                deleteCurrentOfferta,            // callback to invoke with index of button pressed
                'Attenzione',           // title
                ['Si', 'Annulla']         // buttonLabels
            );
        } else {
            $.mobile.changePage("#clienti", {transition: "flip"});
        }
        if (e) {
            e.preventDefault();
        }

    };

    return {
        addItem: addItem,
        deleteItem: deleteItem,
        renderOffertaDetail: renderOffertaDetail,
        checkIsInserted: checkIsInserted,
        deleteCurrentOfferta: deleteCurrentOfferta,
        inviaOfferta: inviaOfferta,
        saveOfferta: saveOfferta,
        getList: getOffertaList,
        detail: getOffertaDetail
    };

})();