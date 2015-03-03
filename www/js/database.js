function initDb() {
	//First, open our db
	dbShell = window.openDatabase("ferramenta", 2, "ferramenta", 1000000);
	//run transaction to create initial tables
	dbShell.transaction(setupTable,dbErrorHandler);
}

//I just create our initial table - all one of em
function setupTable(tx){
	tx.executeSql("CREATE TABLE IF NOT EXISTS Clienti(codice, ragSociale, parIva, categoriaSconto, noTelefono, noCell, noFax, email, indirizzo, cap, comune, provincia, fattCorrente, fattPrecedente, saldoProfessional, saldoService, stato)");
}

function dbErrorHandler(err){
	alert("DB Error: "+err.message + "\nCode="+err.code);
}


function importData() {
	$.mobile.showPageLoadingMsg();

        $.ajax({
            dataType : 'jsonp',
            jsonp : 'jsonp_callback',
            type : 'GET',
            data : {
                action : 'getClientTable'
            },
            url : remoteUrl,
            cache : false,
            timeout : 20000,
            success : function(result) {
            	
           		//Delete all records from local table
            	dbShell.transaction(function(tx) {
            		tx.executeSql("delete from Clienti");
            	}, dbErrorHandler);
            	
            	$.each(result, function() {
            		
            		var codice = this.codice;
            		var ragSociale = this.ragSociale;
            		var parIva = this.parIva;
            		var categoriaSconto = this.categoriaSconto;
            		var noTelefono = this.noTelefono;
            		var noCell = this.noCell;
            		var noFax = this.noFax;
            		var email = this.email;
            		var indirizzo = this.indirizzo;
            		var cap = this.cap;
            		var comune = this.comune;
            		var provincia = this.provincia;
            		var fattCorrente = this.fattCorrente;
            		var fattPrecedente = this.fattPrecedente;
            		var saldoProfessional = this.saldoProfessional;
            		var saldoService = this.saldoService;
            		var stato = this.stato;
            		
            		dbShell.transaction(function(tx) {           			
					//insert the records in the database
						tx.executeSql("insert into Clienti(codice, ragSociale, parIva, categoriaSconto, noTelefono, noCell, noFax, email, indirizzo, cap, comune, provincia, fattCorrente, fattPrecedente, saldoProfessional, saldoService, stato) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
						,[codice, ragSociale, parIva, categoriaSconto, noTelefono, noCell, noFax, email, indirizzo, cap, comune, provincia, fattCorrente, fattPrecedente, saldoProfessional, saldoService, stato]);
					}, dbErrorHandler);
            	});
            	$.mobile.hidePageLoadingMsg();
            	alert('Importazione clienti avvenuta con successo');
            	},
            	
            error : function(result) {
                $.mobile.hidePageLoadingMsg();
                console.log(result);
                //remember to remove this
                alert('Errore di importazione dati');
            }
        });
}


//Raymond Camden's database utility class

/* usage with batch file
 * myDbController.executeBatch("sql/createtables.xml",successHandler,errHandler);
 * <sql>
 * <statement>
 * create table foo if not exists foo(....)
 * </statement>
 * <statement>
 * create table moo if not exists foo(....)
 * </statement>
 * </sql>
 * 
 * 
 * 
 * dbController.executeSql("select * from notes", gotNote, errHandler);
 * 
 * 
 * dbController.init("main","data/seed.xml",dbReady);
 *  
 */
var DBController = function() {

    var db,success,failure;
    
    return {

        init:function(name,importscript,successHandler)    {
            //todo - allow for version
            db = window.openDatabase(name,"1.0",name,100000);            
            if(typeof importscript !== "undefined") {
                console.log("being asked to run a script");
                if(typeof successHandler === "undefined") throw "Invalid call - must pass success handler when importing data";
                this.executeBatch(importscript,successHandler);
            }
        },

        executeBatch:function(path,successHandler,errorHandler) {
            success=successHandler;
            failure=errorHandler;
            
            $.get(path, {}, this.gotFile, "xml");
        },

        //sql, successHandler, errorHandler are required
        executeSql:function(sql,args,successHandler,errorHandler) {
            console.log('going to run '+sql+ ' '+arguments.length);
            //Don't like this - but way to make args be optional and in 2nd place
            if(arguments.length == 3) {
                successHandler = arguments[1];
                errorHandler = arguments[2];
                args = [];
            }
            db.transaction(
                function(tx) { tx.executeSql(sql,args,function(tx,res) {
                    //todo - figure out fraking scoping rules and why line below didnt work, nor this.X
                    //res = translateResultSet(res);
                    var result = [];
                    for(var i=0; i<res.rows.length; i++) {
                        result.push(res.rows.item(i));
                    }
                    successHandler(result);
                })}
            , errorHandler)    
        },
        
            
        gotFile:function(doc) {
            var statements = [];
            var statementNodes=doc.getElementsByTagName("statement");
            for(var i=0; i<statementNodes.length; i++) {
                statements.push(statementNodes[i].textContent);
            }
            if(statements.length) {
                db.transaction(function(tx) {
                    //do nothing
                    for(var i=0;i<statements.length;i++) {
                        tx.executeSql(statements[i]);
                    }
                }, failure,success);
            }
        },
        
        translateResultSet:function(res) {
            var result = [];
            for(var i=0; i<res.rows.length; i++) {
                result.push(res.rows.item(i));
            }
            return result;
            
        }
            
    }
    
};

