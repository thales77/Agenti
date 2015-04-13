/**
 * Created by Babis Boikos on 02/04/2015.
 */

AGENTI.offerta = {
    header: {totaleOfferta : 0},
    detail: [],

    addItemToOfferta: function (itemId, itemDesc, qty, prezzo, nota) {
        var offerta = AGENTI.offerta,
            totaleRiga = parseFloat(qty.replace(',', '.')) * parseFloat(prezzo.replace(',', '.'));


        offerta.detail.push({
            itemId : itemId,
            itemDesc : itemDesc,
            qty : qty,
            prezzo : prezzo,
            totaleRiga : totaleRiga,
            nota: nota
        });

        offerta.header.totaleOfferta = offerta.header.totaleOfferta  +  totaleRiga; //summing the grand total of the offerta


        //navigator.notification.alert("articolo aggiunto all' offerta");
    },

    renderOffertaDetail: function () {
        /*Variable declaration*******************/
        var offerta = AGENTI.offerta;
        /*End of variable declaration************/

        $('#offertaDetail').find('h5').text('Offerta a ' + AGENTI.client.ragSociale);

        $.each(offerta.detail, function () {
            $('#offertaTable tbody').append('<tr><td>' + this.itemId + '</td><td style=" font-weight: bold">' + this.itemDesc + '</td><td>' +
            this.qty.replace(/\./g , ",") + '</td><td>' + '&#8364;' + this.prezzo.replace(/\./g , ",") + '</td>><td>' + '&#8364;' + this.totaleRiga.toFixed(2).replace(/\./g , ",") + '</td><td>' +
            this.nota + '</td><td>' + '<button class="ui-btn ui-icon-delete ui-btn-icon-notext ui-corner-all ui-mini deleteOffertaDetailRow">Cancella</button></td></tr>');
        });

        $('#totaleOfferta').text(offerta.header.totaleOfferta.toFixed(2).replace(/\./g , ","));
        $('noteOffertaHeader').text(offerta.header.note);
        $('#offertaTable').table("refresh");

        //Handle delete button, this shouldn't be here
        $('.deleteOffertaDetailRow').on('tap', function (event) {


            var tableRow =  $(this).parents("tr"); //cache the current row on the dom
            var itemForDeletion = $(this).parents("tr").prevAll("tr").length; //get the number of rows before the row to be deleted, use this for splicing model array
            var totaleRiga = offerta.detail[itemForDeletion].totaleRiga;

            navigator.notification.confirm(
                "Cancellare articolo?",
                // callback
                function (buttonIndex) {
                    if (buttonIndex === 1) {

                        tableRow.remove(); //remove table row from DOM
                        offerta.detail.splice(itemForDeletion, 1); //remove listino from model

                        //update totale in model
                        offerta.header.totaleOfferta = offerta.header.totaleOfferta - totaleRiga;

                        //DOM update total on the page
                        $('#totaleOfferta').text(offerta.header.totaleOfferta.toFixed(2).replace(/\./g , ","));

                        /* if (offerta.detail.length == 0) {
                         $.mobile.changePage('#clientDetail');
                         }*/
                    }
                },            // callback to invoke with index of button pressed
                'Attenzione',           // title
                ['Cancella articolo', 'Annulla']         // buttonLabels
            );

            event.preventDefault();
        });
    },

    checkIsInserted: function (e) {
        var offerta = AGENTI.offerta;
        if (offerta.detail.length !== 0) {
            AGENTI.utils.vibrate();
            navigator.notification.confirm(
                "Cancellare l'offerta inserita?", // message
                offerta.deleteCurrentOfferta,            // callback to invoke with index of button pressed
                'Attenzione',           // title
                ['Elimina offerta', 'Annulla']         // buttonLabels
            );

        } else {
            $.mobile.changePage("#clienti", {transition: "flip"});
        }
        if(e) {
            e.preventDefault();
        }

    },

    deleteCurrentOfferta: function (buttonIndex) {
        if (buttonIndex === 1) {
            AGENTI.offerta.detail.length = 0; //empty offerta detail array
            AGENTI.offerta.header = {totaleOfferta: 0}; //reset offerta total
            $('#totaleOfferta').text(AGENTI.offerta.header.totaleOfferta.toFixed(2).replace(/\./g , ",")); //reset offerta total on DOM
            $('#offertaTable tbody').empty(); // empty table in offerta detail page
            $('#offertaConfermedCheck').attr("checked",false).checkboxradio("refresh");

            navigator.notification.alert('Offerta cancellata');
        }

    },

    inviaOfferta: function () {
        var offerta = AGENTI.offerta,
            emailProperties = {
                to: AGENTI.client.email,
                cc: [AGENTI.db.getItem('email')],
                subject: 'Offerta Sidercampania Professional srl',
                isHtml: true
            },
            tableData = [],
            columns = [],
            options = {},
            height = 180,
            splitText = "",
            noteHeight = 0;

        if (offerta.detail.length !== 0) {


            //FIRST GENERATE THE PDF DOCUMENT
            offerta.pdfFileName = 'offerta.pdf';
            offerta.header.note = $('#noteOffertaHeader').val();

            console.log("generating pdf...");
            var doc = new jsPDF('p', 'pt', 'a4');

            doc.setFontSize(20);
            doc.setFontType("bold");
            doc.text(20, 50, 'Sidercampania Professional srl');

            doc.setFontSize(12);
            doc.setFontType("normal");
            doc.text(20, 65, 'Offerta commerciale');

            doc.setFontSize(10);
            doc.text(20, 80, 'Spett.le: ' + AGENTI.client.ragSociale);
            doc.text(20, 95, AGENTI.client.indirizzo);
            doc.text(20, 110, AGENTI.client.indirizzo2);

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


            $.each(offerta.detail, function () {

                tableData.push({
                    "codice": this.itemId,
                    "descrizione": this.itemDesc,
                    "nota": this.nota,
                    "qta": this.qty.replace(/\./g, ","),
                    "prezzo": this.prezzo.replace(/\./g, ","),
                    "totale": this.totaleRiga.toFixed(2).replace(/\./g, ",") //change into string again and replace dots with comas
                });
                height = height + 20;
            });

            doc.autoTable(columns, tableData, options);
            //height = doc.drawTable(tableData, {xstart:15,ystart:20,tablestart:50,marginleft:50, xOffset:5, yOffset:5});

            doc.setFontType("bolditalic");
            doc.setFontSize(12);
            doc.text(400, height, 'Totale offerta: ' + offerta.header.totaleOfferta.toFixed(2).replace(/\./g, ",") + ' +IVA');

            doc.setFontType("normal");
            doc.setFontSize(10);
            doc.text(20, height + 20, 'Note aggiuntive: ');
            splitText = doc.splitTextToSize(offerta.header.note, 550); //this text could be long so we have to split it in chunks
            doc.text(20, height + 35, splitText);

            noteHeight = splitText.length * 15; //push everything bellow the notes field down according to how many lines its is (lines*15pt)

            doc.setFontType("bolditalic");
            doc.setFontSize(10);
            doc.text(20, height + noteHeight + 70, 'La Sidercampania Professional srl non e\' responsabile per eventuali ritardi di consegna del materiale, dovuta ');
            doc.text(20, height + noteHeight + 85, 'ai nostri fornitori ed il loro ciclo di produzione e trasporto.');
            doc.text(20, height + noteHeight + 110, 'Validita\' offerta 15gg');

            doc.setFontType("normal");
            doc.text(20, height + noteHeight + 125, 'Nominativo addetto: ' + AGENTI.db.getItem('full_name'));

            var pdfOutput = doc.output();
            console.log(pdfOutput);

            function pdfSave(name, data, success, fail) {

                var gotFileSystem = function (fileSystem) {

                    offerta.pdfFilePath = fileSystem.root.nativeURL;

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

            pdfSave(offerta.pdfFileName, pdfOutput, function () {

                // success! - generate email body
                emailProperties.body = Date.today().toString("dd-MM-yyyy") + '<h3>Spettabile cliente ' + AGENTI.client.ragSociale + '</h3>' +
                '<p>A seguito Vs. richiesta inviamo in allegato la ns. migliore offerta relativa agli articoli specificati.<br>' +
                'Attendiamo Vs. conferma per procedere con l&apos;evasione dell&apos;ordine.</p>' +
                '<p>Distini saluti,<br>' + AGENTI.db.getItem('full_name') + '<br>Sidercampania Professional srl<br>' +
                'tel. 0817580177<br>Fax 0815405590</p>';


                emailProperties.attachments = offerta.pdfFilePath + offerta.pdfFileName;

                //if offerta is definitiva add the 'vendite' email to the cc array of emaiProperties
                if ($('#offertaConfermedCheck').is(':checked')) {
                    emailProperties.cc.push('vendite@siderprofessional.com');
                }

                cordova.plugins.email.open(emailProperties, function () {
                    //navigator.notification.alert('invio annullato'); //fix this, it always executes his part
                }, this);


            }, function (error) {
                // handle error
                console.log(error);
                navigator.notification.alert(error);
            });

        }
    }

};