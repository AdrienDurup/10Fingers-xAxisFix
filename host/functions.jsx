
Page.prototype.changeSide = function() {
    //alert('Page.protoype.changeSide() running...');
var ObjPosBasedOnMargin = true;
var marginDiff=this.marginPreferences.left-this.marginPreferences.right;
//alert(marginDiff);
        var xSave = [];
        var itemColl=this.pageItems;
        for (var i = 0; i < itemColl.length; i++) {
            var value=itemColl[i].geometricBounds[1];
            xSave.push(value);//POSITION EN X SANS LA MARGE        
            //alert(this.marginPreferences.left+" + "+xSave[xSave.length-1]+" = "+itemColl[i].geometricBounds[1]);
        };

    try {
        if (this.parent.pages.length == 1) {
            if (this.side.toString() == 'LEFT_HAND') {
                this.move(LocationOptions.AFTER, this.parent, BindingOptions.RIGHT_ALIGN);
                //marginDiff stay as it is
            } else if (this.side.toString() == 'RIGHT_HAND') {
                this.move(LocationOptions.BEFORE, this.parent, BindingOptions.LEFT_ALIGN);
                marginDiff*=-1;//marginDiff is reversed
                
            };

            for (var i = 0; i < this.pageItems.length; i++) {
                var newXValue=xSave[i]+marginDiff;
                //alert(this.marginPreferences.left+" + "+xSave[i]+" = "+newXValue);
                        this.pageItems[i].move([newXValue, this.pageItems[i].geometricBounds[0]],undefined)

            }; //FOR
            ctrl02 = 0;
        };
    } catch (e) {
        alert(e);
    };
    //alert('Page.protoype.changeSide() ended');
}
// Page.prototype.changeSide = function() {
//     //alert('Page.protoype.changeSide() running...');
// var ObjPosBasedOnMargin = true;
// var marginDiff=this.marginPreferences.left-this.marginPreferences.right;
// alert(marginDiff);
//     function saveItemInfo(itemColl) { //REMPLACER PAR UN OBJET QUI CONTIENDRAIT TOUTES LES DONNEES UTILES AU REPLACEMENT DES OBJETS
//         var arr = [];
//         for (var i = 0; i < itemColl.length; i++) {
//             arr.push(itemColl[i].geometricBounds[1]);
//         };
//         return arr;
//     }

//     try {
//         if (this.parent.pages.length == 1) {
//             var xSave = saveItemInfo(this.pageItems);
//             if (this.side.toString() == 'LEFT_HAND') {
//                 this.move(LocationOptions.AFTER, this.parent, BindingOptions.RIGHT_ALIGN);
//             } else if (this.side.toString() == 'RIGHT_HAND') {
//                 this.move(LocationOptions.BEFORE, this.parent, BindingOptions.LEFT_ALIGN);
//             };

//             for (var i = 0; i < this.pageItems.length; i++) {
//                 //OLD ========================
//                 //var offsetForFix = xSave[i] - this.pageItems[i].geometricBounds[1];
//                 //OLD ========================

//                 //alert(offsetForFix);
//                                 if (marginDiff != 0) {
//                     try {
//                         alert("do it");
//                         this.pageItems[i].move(undefined, [marginDiff, 0])//on deplace une première fois si il y a inadéquation entre position de départ et d'arrivée (calculé d'après l'origine, donc ne tient pas compte des marges)

//                     } catch (e) {
//                         alert('erreur : ' + e);
//                     }; //TRY CATCH
//                     };//IF
//                     //OLD ========================
//                 // if (offsetForFix != 0) {
//                 //     try {
//                 //         this.pageItems[i].move(undefined, [offsetForFix, 0])//on deplace une première fois si il y a inadéquation entre position de départ et d'arrivée (calculé d'après l'origine, donc ne tient pas compte des marges)

//                 //     } catch (e) {
//                 //         alert('erreur : ' + e);
//                 //     }; //TRY CATCH
//                 //     };//IF
//                 //OLD ========================
//             }; //FOR
//             ctrl02 = 0;
//         };
//     } catch (e) {
//         alert(e);
//     };
//     //alert('Page.protoype.changeSide() ended');
// }

Page.prototype.moveBetweenSpreads = function(locOpt, targetPage) {
    var newSpread = app.activeDocument.spreads.add(locOpt, targetPage.parent);
    try {
        if (this.side.toString() == "LEFT_HAND") {
            newSpread.pages[0].remove();
            //this.move(LocationOptions.BEFORE, newSpread, binding);
            this.move(LocationOptions.BEFORE, newSpread, BindingOptions.LEFT_ALIGN);
            newSpread.pages[1].remove();
        } else if (this.side.toString() == "RIGHT_HAND") {
            newSpread.pages[1].remove();
            this.move(LocationOptions.AFTER, newSpread, BindingOptions.RIGHT_ALIGN);
            //this.move(LocationOptions.AFTER, newSpread, binding);
            newSpread.pages[0].remove();
        };

    } catch (e) {
        alert(e);
    };
}

function switchSideJSX() {
    app.doScript(switchSideExec, ScriptLanguage.JAVASCRIPT, undefined, UndoModes.ENTIRE_SCRIPT, "Changer la page de côté");
}

function switchSideExec() {
    //alert('switchSideJSX() running...');
    //var liquidLayoutEnabled=app.activeDocument.;
    var MyActivePage = app.activeDocument.layoutWindows[0].activePage;
    MyActivePage.changeSide();
    //alert('switchSideJSX() ended');
}

function movePageJSX(num) {
    var numArr = [num];
    app.doScript(movePage, ScriptLanguage.JAVASCRIPT, numArr, UndoModes.ENTIRE_SCRIPT, "Déplacer la page");
}

function movePage(num) {
    //alert('movePage() running');
    num = num[0]; //Evite bug de problème de typage à cause de doScript qui utilise un Array pour passer les paramètres.
    //alert(typeof num);
    try {
        var doc = app.activeDocument;
        doc.documentPreferences.allowPageShuffle = false;
        var activePage = doc.layoutWindows[0].activePage;
        try {
            var pageToPush = doc.pages.itemByName(num.toString());
        } catch (e) {
            alert('Erreur (numéro de page ?): ' + e);
        };

        var sideA = activePage.side.toString();
        var sideB = pageToPush.side.toString();

        var activePageOffset = activePage.documentOffset;
        var futurePageOffset = pageToPush.documentOffset;
        if (activePageOffset < futurePageOffset) {
            var moveData = {
                'sideValue1': 'LEFT_HAND',
                'sideValue2': 'RIGHT_HAND',
                'bindingValue1': BindingOptions.LEFT_ALIGN,
                'bindingValue2': BindingOptions.RIGHT_ALIGN,
                'locOptValue1': LocationOptions.BEFORE,
                'locOptValue2': LocationOptions.AFTER,
                'prevNextPage': 'next'

            };
        } else if (activePageOffset > futurePageOffset) {
            var moveData = {
                'sideValue2': 'LEFT_HAND',
                'sideValue1': 'RIGHT_HAND',
                'bindingValue2': BindingOptions.LEFT_ALIGN,
                'bindingValue1': BindingOptions.RIGHT_ALIGN,
                'locOptValue2': LocationOptions.BEFORE,
                'locOptValue1': LocationOptions.AFTER,
                'prevNextPage': 'prev'
            };
        };
        moveForwardBackward(doc, activePage, num, pageToPush, sideA, sideB, moveData);
    } catch (e) {
        alert(e)
    };
}

function moveForwardBackward(doc, activePage, num, pageToPush, sideA, sideB, data) {
    //alert('moveForward() running');
    //alert(typeof num);
    try {
        if (pageToPush != doc.pages[0] && data.prevNextPage == 'prev') {
            var prevNextPage = doc.pages.itemByName((num - 1).toString());
        };
        if (pageToPush !== doc.pages[doc.pages.length - 1] && data.prevNextPage == 'next') {
            var prevNextPage = doc.pages.itemByName((num + 1).toString());
        };
    } catch (e) {
        alert('erreur sur moveForwardBackward() : ' + e);
    };
    ///////////// AJOUTER UN CONTROLE SUR PREVIOUS OU NEXT //////////////////
    function myTrigger() { // ATTENTION : L'ORDRE DES IFs EST IMPORTANT
        try {
            if (sideB == data.sideValue1 && pageToPush.parent.pages.length == 2) {
                //alert(1);
                return 1;
            };
            if (sideA == data.sideValue2 && sideB == data.sideValue1 && pageToPush.parent.pages.length == 1) {
                //alert(2);
                return 2;

            };
            if (sideA == data.sideValue1 && prevNextPage != undefined && prevNextPage.side.toString() == data.sideValue2 && prevNextPage.parent.pages.length == 1) {
                //alert(3);
                return 3;

            };
            //if (sideB == data.sideValue2 || (pageToPush == doc.pages[doc.pages.length - 1])) {
            //alert(0);
            return 0;
            //};
            //return 'error';
        } catch (e) {
            alert('Erreur sur moveForward/myTrigger() : ' + e);
        };
    }


    switch (myTrigger()) {
        case 0:
            activePage.moveBetweenSpreads(data.locOptValue2, pageToPush);
            break;
        case 1:
            pageToPush.moveBetweenSpreads(data.locOptValue1, pageToPush);
            activePage.moveBetweenSpreads(data.locOptValue2, pageToPush);
            break;
        case 2:
            activePage.move(data.locOptValue2, pageToPush, data.bindingValue2);
            break;
        case 3:
            activePage.move(data.locOptValue1, prevNextPage, data.bindingValue1);
            break;
        case 'error':
            alert('Erreur : cas non trouvé');
            break;

    };
}

///////BACKUP PLUS LISIBLE//////////////
// function movePage(num) {
//     //alert('movePage() running');
//     num=num[0];//Evite bug de problème de typage à cause de doScript qui utilise un Array pour passer les paramètres.
//     //alert(typeof num);
//     try {
//         var doc = app.activeDocument;
//         doc.documentPreferences.allowPageShuffle = false;
//         var activePage = doc.layoutWindows[0].activePage;
//         try {
//             var pageToPush = doc.pages.itemByName(num.toString());
//         } catch (e) {
//             alert('Erreur (numéro de page ?): ' + e);
//         };

//         var sideA = activePage.side.toString();
//         var sideB = pageToPush.side.toString();

//         var activePageOffset = activePage.documentOffset;
//         var futurePageOffset = pageToPush.documentOffset;
//         if (activePageOffset < futurePageOffset) {
//             moveForward(doc, activePage, num, pageToPush, sideA, sideB);
//         } else if (activePageOffset > futurePageOffset) {
//             moveBackward(doc, activePage, num, pageToPush, sideA, sideB);
//         };
//     } catch (e) {
//         alert(e)
//     };
// }

// function moveForward(doc, activePage, num, pageToPush, sideA, sideB) {
//     //alert('moveForward() running');
//     //alert(typeof num);
//     try {
//         if (pageToPush !== doc.pages[doc.pages.length - 1]) {
//             var nextPage = doc.pages.itemByName((num + 1).toString());
//             //alert(nextPage.name);
//             //alert('pas la première');
//         };
//     } catch (e) {
//         alert('erreur moveForward : ' + e);
//     };
//     ///////////// AJOUTER UN CONTROLE SUR PREVIOUS OU NEXT //////////////////
//     function myTrigger() { // ATTENTION : L'ORDRE DES IFs EST IMPORTANT
//         try {
//             if (sideB == 'LEFT_HAND' && pageToPush.parent.pages.length == 2) {
//                 //alert(1);
//                 return 1;
//             };
//             if (sideA == 'RIGHT_HAND' && sideB == 'LEFT_HAND' && pageToPush.parent.pages.length == 1) {
//                 //alert(2);
//                 return 2;

//             };
//             if (sideA == 'LEFT_HAND' && nextPage != undefined && nextPage.side.toString() == 'RIGHT_HAND' && nextPage.parent.pages.length == 1) {
//                 //alert(3);
//                 return 3;

//             };
//             //if (sideB == 'RIGHT_HAND'||(pageToPush==doc.pages[doc.pages.length - 1])) {
//                 //alert(0);
//                 return 0;
//             //};
//             //return 'error';
//         } catch (e) {
//             alert('Erreur sur moveForward/myTrigger() : ' + e);
//         };
//     }


//     switch (myTrigger()) {
//         case 0:
//             activePage.moveBetweenSpreads(LocationOptions.AFTER, pageToPush);
//             break;
//         case 1:
//             pageToPush.moveBetweenSpreads(LocationOptions.BEFORE, pageToPush);
//             activePage.moveBetweenSpreads(LocationOptions.AFTER, pageToPush);
//             break;
//         case 2:
//             activePage.move(LocationOptions.AFTER, pageToPush, BindingOptions.RIGHT_ALIGN);
//             break;
//         case 3:
//             activePage.move(LocationOptions.BEFORE, nextPage, BindingOptions.LEFT_ALIGN);
//             break;
//         case 'error':
//             alert('Erreur : cas non trouvé');
//             break;

//     };
// }

// function moveBackward(doc, activePage, num, pageToPush, sideA, sideB) {
//     // alert('moveBackward() running');
//     if (pageToPush != doc.pages[0]) {
//         var previousPage = doc.pages.itemByName((num - 1).toString());
//         //alert('pas la première');
//     };

//     ///////////// AJOUTER UN CONTROLE SUR PREVIOUS OU NEXT //////////////////
//     function myTrigger() { // ATTENTION : L'ORDRE DES IFs EST IMPORTANT

//         if (sideB == 'RIGHT_HAND' && pageToPush.parent.pages.length == 2) {
//             return 1;
//         };
//         if (sideA == 'LEFT_HAND' && sideB == 'RIGHT_HAND' && pageToPush.parent.pages.length == 1) {
//             //alert(2);
//             return 2;

//         };

//         if (sideA == 'RIGHT_HAND' && previousPage != undefined && previousPage.side.toString() == 'LEFT_HAND' && previousPage.parent.pages.length == 1) {
//             //alert(3);
//             return 3;

//         };
//         //if (sideB == 'LEFT_HAND'||(pageToPush==doc.pages[0])) {
//             //alert(0);
//             return 0;
//         //};

//     }


//     switch (myTrigger()) {
//         case 0:
//             activePage.moveBetweenSpreads(LocationOptions.BEFORE, pageToPush);
//             break;
//         case 1:
//             pageToPush.moveBetweenSpreads(LocationOptions.AFTER, pageToPush);
//             activePage.moveBetweenSpreads(LocationOptions.BEFORE, pageToPush);
//             break;
//         case 2:
//             activePage.move(LocationOptions.BEFORE, pageToPush, BindingOptions.LEFT_ALIGN);
//             break;
//         case 3:
//             activePage.move(LocationOptions.AFTER, previousPage, BindingOptions.RIGHT_ALIGN);
//             break;

//     };

// }