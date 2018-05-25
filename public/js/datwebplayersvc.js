/// <reference path="linq-vsdoc.js" />
(function (prweb, $) {
    prweb.datwebplayersvc = (function () {

        var sps = {};

        sps.NewDatPlayerSvc = function () {
            var that = {};

            that.Vmx = {
                datpage: null
            };

            
            //this method is called by datwebappmain.datSingle1 bindings handlers...returns the contentmodelcolxn...
            that.newDatPage = function () {
                //#region PageEntry
                var pageentry = {
                    datObjectJs: {},
                    displaymode:false,
                    contentelements: [],
                    isloaded: ko.observable(false), //isloaded is true for testing...
                    //pgobj: ko.observable({
                    //    pcelemcolxn: ko.observableArray()
                    //}),
                    // widgetizeAddedElement: sps.WigdetizeElement,
                    pgnum: 1,// could be used when we are showing a campaign...
                    tohtml: null,
                    makepgobj: null,
                    retrievePage: null,
                    updatePercents: null,
                    voteHandler: null,
                    init: null,
                    dispose: false
                };
                //#endregion page entry
                //#region tomodelcore
                pageentry.tomodelcore = function (T) {
                    var rslt = {
                        modelcore:{
                            presenterT: T,
                            html: ko.observable(prweb.pCElemHtmlDxnry[T].resourceModel)
                        }
                    };
                    return rslt;
                };
                //#endregion
                //#region datTypeMethods
                var dattypeMethods = {
                    matchCountablesToJson: function (singlecountables, iseditcountablecolxn) {
                        try {
                            Enumerable.From(singlecountables).ForEach(function (cntble) {
                                var matchedJsonCntble = Enumerable.From(iseditcountablecolxn)
                                .Where(function (c) {
                                    var rslt = false;
                                    try {
                                        if (c["objectId"] == cntble["objectId"] || c["guid"] == cntble["guid"]) {
                                            rslt = true;
                                        } else {
                                            var txtmatch = true;
                                            var urlmatch = true;
                                            var imagematch = true;
                                            if (c["textEditables"]) {
                                                txtmatch = c["textEditables"].titleText == cntble.titleText;
                                                rslt = txtmatch && imagematch;
                                            }
                                            if (c["linkedMediaObject"]) {
                                                urlmatch = c["linkedMediaObject"]["contentUrl"] == cntble.datElementText;
                                                rslt = txtmatch && urlmatch;
                                            }
                                            if (rslt && c["mainImageObject"]) {
                                                if (c["mainImageObject"]["datImageObjectFromUrl"]) {
                                                    var dimo = c["mainImageObject"]["datImageObjectFromUrl"]["datimgurl"]
                                                    if (cntble.elementImage) {
                                                        imagematch = dimo == cntble.elementImage.url();
                                                    } else {
                                                        var wtf = true;//no element image...
                                                    }
                                                } else if (c["linkedMediaObject"] && !cntble.elemementImage) {
                                                    //cntble.elementImage = c["mainImageObject"]["url"];
                                                    //this needs to be object with a url function
                                                    var xurl = c["mainImageObject"]["url"];
                                                    cntble.elementImage = { url: function () { return xurl; } };
                                                } else {
                                                    var imo = c["mainImageObject"].url;
                                                    imagematch = imo == cntble.elementImage.url();
                                                }
                                                rslt = txtmatch && urlmatch && imagematch;
                                            }
                                        }
                                    }
                                    catch (ex) {
                                        var wtf = true;
                                        rslt = false;
                                    }
                                    return rslt;
                                }).Select(function (jcntble) {
                                    return jcntble;
                                }).FirstOrDefault();
                                if (matchedJsonCntble) {
                                    if (matchedJsonCntble['datImageId'] == cntble['datImgId']) {
                                        if (matchedJsonCntble['mainImageObject']) {
                                            if (matchedJsonCntble['mainImageObject']["url"] == false) {
                                                matchedJsonCntble['mainImageObject']["url"] = cntble['elementImage']["url"]();
                                            }
                                        }
                                    }
                                    matchedJsonCntble['objectId'] = cntble['objectId'];
                                    matchedJsonCntble['responseCount'] = cntble['responseCount'];
                                    Enumerable.From(["titleText", "headerText", "datElementText"]).ForEach(function (p) {
                                        matchedJsonCntble["textEditables"][p] = cntble[p];
                                    });
                                    cntble["datJsonCntble"] = matchedJsonCntble;
                                }
                            });
                        }
                        catch (ex) {
                            var wtf = true;
                        }
                        
                    },
                    //#region datType 12
                    "12": {
                        makeEditpgobj: function (xoptionset) {
                            var toEdithtml = function (optionset) {
                                var rslt = [];
                                try {
                                    if (xoptionset["headerQuestionTextEditables"]) {
                                        var x = xoptionset["headerQuestionTextEditables"];
                                        var yes = true;
                                    }
                                    var singledatcomplete = optionset.iseditobj.singlepnldc.datcomplete;
                                    var singlecountables = singledatcomplete["countables"] || [];
                                    dattypeMethods.matchCountablesToJson(singlecountables, optionset.iseditobj["countableColxn"]);
                                    var toemojis = function (elementIndex) {
                                        var elemndx = "datEmoji" + ((elementIndex || 0) + 1);
                                        ordered[x]['emoji'] = prweb.toImgUrl(prweb.pCElemHtmlDxnry[elemndx].resourceFile);
                                    };
                                    var toCountablesColxn = function (cnt) {
                                        var toNewCntble = function (ndx) {
                                            var newcntble = {
                                                objectId: 0,
                                                isdatfiveeditaddnew: false,
                                                elementImage: prweb.toImgUrl(prweb.pCElemHtmlDxnry["datPhotoVideoIcon1"].resourceFile),
                                                elementimage: prweb.toImgUrl(prweb.pCElemHtmlDxnry["datPhotoVideoIcon1"].resourceFile),
                                                elementIndex: ndx,
                                                elementindex: ndx,
                                                countablesIndex: ndx,
                                                datElementText: ndx + " create new text here...",
                                                responseCount: 0,
                                                dispose: false
                                            }
                                            return newcntble;
                                        };
                                        return Enumerable.Range(0, cnt).Select(function (c) {
                                            return toNewCntble(c);
                                        }).ToArray();
                                    };
                                    var torespPctString = function (count, totresp) {
                                        var xcount = count || 0;
                                        var xtotresp = totresp || 1;
                                        var mypct = (xcount / xtotresp) * 100;
                                        return ((Math.round(mypct * Math.pow(10, 1)) / Math.pow(10, 1)).toString() + '%');
                                    };
                                    //var dcecolxn = toCountablesColxn(optionset.countablesCount);
                                    //var orderedDces = dcecolxn;//these have to ordered by their appearance in the DOM....
                                    var totResp = 0;//Enumerable.From(dcecolxn).Sum(function (dce) { return dce.responseCount });
                                    var addNewObsPCElem = function (colxnlength) {
                                        var countable = toCountablesColxn(1)[0];
                                        countable.elementIndex = colxnlength;
                                        return toObsPCElem(countable, colxnlength);
                                    };
                                    var addNewItemHandler = function (kodata, pnl, isautoadded) {
                                        //kodata is the obspcelem that was just tapped...
                                        //this method is called from the datFiveEdit1 tap handler...
                                        var newitem = {};
                                        try {
                                            var contentmodelcolxn = pnl["currentDatUniverseMember"].xcolxn;//pnl.contentmodelcolxn();
                                            newitem = addNewObsPCElem(contentmodelcolxn.length || 3);
                                            newitem["guid"] = newitem["guid"] || prweb.NewGuid();
                                            if (!isautoadded) {
                                                newitem["isdatfiveeditaddnew"](true);
                                                kodata["isdatfiveeditaddnew"](false);
                                                pnl["datSingleEditSvc"].addNewDat125(kodata, newitem);
                                            } else {
                                                var x = 1;
                                                return newitem;
                                                //returns newitem...
                                            }

                                        }
                                        catch (ex) {
                                            var wtf = true;
                                        }

                                        var yes = true;

                                    };
                                    var toObsPCElem = function (countable, cndx) {
                                        var rslt = {};
                                        try {
                                            var presT = "dat125";//topresT(orderedDces[n]);//dcecolxn[n]//.modelcore.presenterT;
                                            var obspcelem = sps.observablemodelsvc.PCElemFromJSData(presT, countable);
                                            obspcelem.datid = -1;
                                            obspcelem["guid"] = countable["guid"] || prweb.NewGuid();
                                            if (presT == 'dat125') {
                                                if (totResp == 0) {
                                                    totResp = 1;
                                                }
                                                var mypct = (countable.responseCount / totResp) * 100;
                                                var pctstr = ((Math.round(mypct * Math.pow(10, 1)) / Math.pow(10, 1)).toString() + '%');
                                                obspcelem.modelcore.responsePercent(pctstr);
                                                obspcelem.votehandler = pageentry.voteHandler;
                                                obspcelem["countablesIndex"] = cndx;
                                                obspcelem["countables"] = [countable];//orderedDces;
                                                obspcelem["winner"] = countable;//orderedDces[0];
                                                var islast = (optionset.countablesCount - 1) == cndx;
                                                obspcelem["isdatfiveeditaddnew"] = ko.observable(islast);
                                                if (countable["mainImageObject"]) {
                                                    obspcelem["mainImageObject"] = countable["mainImageObject"];
                                                    if (countable["mainImageObject"]["datImgId"]) {
                                                        obspcelem["isimagepopulated"] = ko.observable(true);
                                                    } else {
                                                        obspcelem["isimagepopulated"] = ko.observable(false);
                                                    }
                                                } else {
                                                    obspcelem["isimagepopulated"] = ko.observable(false);
                                                    obspcelem["mainImageObject"] = { url: false, datImgId: false };
                                                }


                                                if (countable["linkedMediaObject"]) {
                                                    obspcelem["islinkedmediapopulated"] = ko.observable(true);
                                                    obspcelem["linkedMediaObject"] = ko.observable(countable["linkedMediaObject"]);
                                                } else {
                                                    obspcelem["islinkedmediapopulated"] = ko.observable(false);
                                                    obspcelem["linkedMediaObject"] = ko.observable(false);
                                                }
                                                obspcelem["verbatimResponseObject"] = ko.observable(false);
                                                obspcelem.modelcore.elementImage = ko.observable(countable.elementImage);
                                                obspcelem.modelcore["titleText"] = ko.observable(countable.titleText);
                                                var linkedmediaicon = prweb.pCElemHtmlDxnry["datLinkedMediaIcon1"].resourceFile.url();
                                                obspcelem["exposeLinkPasteArea"] = ko.observable(false);
                                                obspcelem.modelcore["linkedMediaIcon"] = ko.observable(linkedmediaicon);
                                                obspcelem.modelcore["seeStoryUrl"] = ko.observable();
                                                obspcelem["addNewItem"] = addNewItemHandler;
                                                rslt = obspcelem;
                                            }
                                        }
                                        catch (ex) {
                                            var wtf = true;
                                        }
                                        return rslt;
                                    };
                                    optionset.countablesCount = optionset.iseditobj["countableColxn"].length + 1;
                                    Enumerable.From(singlecountables)
                                        .ForEach(function (countable, cndx) {
                                            var toNewCntble = function (ndx) {
                                                var rslt = {
                                                    objectId: 0,
                                                    isdatfiveeditaddnew: false,
                                                    elementImage: prweb.toImgUrl(prweb.pCElemHtmlDxnry["datPhotoVideoIcon1"].resourceFile),
                                                    elementimage: prweb.toImgUrl(prweb.pCElemHtmlDxnry["datPhotoVideoIcon1"].resourceFile),
                                                    elementIndex: ndx,
                                                    elementindex: ndx,
                                                    countablesIndex: ndx,
                                                    titleText: "",
                                                    headerText: "",
                                                    datElementText: "",
                                                    responseCount: 0,
                                                    dispose: false
                                                }
                                                try {
                                                    rslt["objectId"] = countable["objectId"];
                                                    rslt['responseCount'] = countable['responseCount'];
                                                    if (countable["datJsonCntble"]) {
                                                        if (countable["datJsonCntble"]["linkedMediaObject"]) {
                                                            rslt["linkedMediaObject"] = countable["datJsonCntble"]["linkedMediaObject"];
                                                            Enumerable.From(["url"]).ForEach(function (p) {
                                                                //rslt[p] = countable[p];
                                                                var yes = true;
                                                            });
                                                            var yes = true;
                                                        }
                                                        if (countable["datJsonCntble"]["mainImageObject"]) {
                                                            rslt["elementImage"] = countable["datJsonCntble"]["mainImageObject"].url;
                                                            rslt["elementimage"] = countable["datJsonCntble"]["mainImageObject"].url;
                                                            rslt["mainImageObject"] = countable["datJsonCntble"]["mainImageObject"];
                                                            var yes = true;
                                                        }
                                                        if (countable["datJsonCntble"]["textEditables"]) {
                                                            rslt["textEditables"] = countable["datJsonCntble"]["textEditables"];
                                                            Enumerable.From(["titleText", "headerText", "datElementText"]).ForEach(function (p) {
                                                                rslt[p] = countable["datJsonCntble"]["textEditables"][p];
                                                            });
                                                            var yes = true;
                                                        }
                                                    } else {

                                                    }
                                                }
                                                catch (ex) {
                                                    var wtf = true;
                                                }
                                                
                                                
                                                return rslt;
                                            };
                                            rslt.push(toObsPCElem(toNewCntble(), cndx));
                                        });
                                    rslt.push(addNewObsPCElem(optionset.iseditobj["countableColxn"].length));
                                }
                                catch (ex) {
                                    var wtf = true;
                                }
                                return rslt;
                            };
                            var contentmodelcolxn = toEdithtml(xoptionset.datcomplete);
                            pageentry.contentelements = contentmodelcolxn;
                            return contentmodelcolxn;
                        },
                        makedefaultpgobj: function (xoptionset) {
                            var todefaulthtml = function (optionset) {
                                var rslt = [];
                                try {
                                    var toemojis = function (elementIndex) {
                                        var elemndx = "datEmoji" + ((elementIndex || 0) + 1);
                                        ordered[x]['emoji'] = prweb.toImgUrl(prweb.pCElemHtmlDxnry[elemndx].resourceFile);
                                    };
                                    var toCountablesColxn = function (cnt) {
                                        var toNewCntble = function (ndx) {
                                            var newcntble = {
                                                objectId: 0,
                                                isdatfiveeditaddnew: false,
                                                elementImage: prweb.toImgUrl(prweb.pCElemHtmlDxnry["datPhotoVideoIcon1"].resourceFile),
                                                elementimage: prweb.toImgUrl(prweb.pCElemHtmlDxnry["datPhotoVideoIcon1"].resourceFile),
                                                elementIndex: ndx,
                                                elementindex: ndx,
                                                countablesIndex: ndx,
                                                datElementText: ndx + " create new text here...",
                                                responseCount: 0,
                                                dispose: false
                                            }
                                            return newcntble;
                                        };
                                        return Enumerable.Range(0, cnt).Select(function (c) {
                                            return toNewCntble(c);
                                        }).ToArray();
                                    };
                                    var torespPctString = function (count, totresp) {
                                        var xcount = count || 0;
                                        var xtotresp = totresp || 1;
                                        var mypct = (xcount / xtotresp) * 100;
                                        return ((Math.round(mypct * Math.pow(10, 1)) / Math.pow(10, 1)).toString() + '%');
                                    };
                                    //var dcecolxn = toCountablesColxn(optionset.countablesCount);
                                    //var orderedDces = dcecolxn;//these have to ordered by their appearance in the DOM....
                                    var totResp = 0;//Enumerable.From(dcecolxn).Sum(function (dce) { return dce.responseCount });
                                    var addNewObsPCElem = function (colxnlength) {
                                        var countable = toCountablesColxn(1)[0];
                                        countable.elementIndex = colxnlength;
                                        return toObsPCElem(countable, colxnlength);
                                    };
                                    var addNewItemHandler = function (kodata, pnl, isautoadded) {
                                        //kodata is the obspcelem that was just tapped...
                                        //this method is called from the datFiveEdit1 tap handler...
                                        var newitem = {};
                                        try {
                                            var contentmodelcolxn = pnl["currentDatUniverseMember"].xcolxn;//pnl.contentmodelcolxn();
                                            newitem = addNewObsPCElem(contentmodelcolxn.length || 3);
                                            if (!isautoadded) {
                                                newitem["isdatfiveeditaddnew"](true);
                                                kodata["isdatfiveeditaddnew"](false);
                                                pnl["datSingleEditSvc"].addNewDat125(kodata, newitem);
                                            } else {
                                                var x = 1;
                                                return newitem;
                                                //returns newitem...
                                            }

                                        }
                                        catch (ex) {
                                            var wtf = true;
                                        }

                                        var yes = true;

                                    };
                                    var toObsPCElem = function (countable, cndx) {
                                        var rslt = {};
                                        try {
                                            var presT = "dat125";//topresT(orderedDces[n]);//dcecolxn[n]//.modelcore.presenterT;
                                            var obspcelem = sps.observablemodelsvc.PCElemFromJSData(presT, countable);
                                            obspcelem.datid = -1;
                                            obspcelem["guid"] = countable["guid"] || prweb.NewGuid();
                                            if (presT == 'dat125') {
                                                if (totResp == 0) {
                                                    totResp = 1;
                                                }
                                                var mypct = (countable.responseCount / totResp) * 100;
                                                var pctstr = ((Math.round(mypct * Math.pow(10, 1)) / Math.pow(10, 1)).toString() + '%');
                                                obspcelem.modelcore.responsePercent(pctstr);
                                                obspcelem.votehandler = pageentry.voteHandler;
                                                obspcelem["countablesIndex"] = cndx;
                                                obspcelem["countables"] = [countable];//orderedDces;
                                                obspcelem["winner"] = countable;//orderedDces[0];
                                                var islast = (optionset.countablesCount - 1) == cndx;
                                                obspcelem["isdatfiveeditaddnew"] = ko.observable(islast);
                                                obspcelem["isimagepopulated"] = ko.observable(false);
                                                obspcelem["islinkedmediapopulated"] = ko.observable(false);
                                                obspcelem["linkedMediaObject"] = ko.observable(false);
                                                obspcelem["mainImageObject"] = { url: false, datImgId: false };
                                                obspcelem["verbatimResponseObject"] = ko.observable(false);
                                                obspcelem.modelcore.elementImage = ko.observable(countable.elementImage);
                                                obspcelem.modelcore["titleText"] = ko.observable();
                                                var linkedmediaicon = prweb.pCElemHtmlDxnry["datLinkedMediaIcon1"].resourceFile.url();
                                                obspcelem.modelcore["linkedMediaIcon"] = ko.observable(linkedmediaicon);
                                                obspcelem["exposeLinkPasteArea"] = ko.observable(false);
                                                obspcelem.modelcore["seeStoryUrl"] = ko.observable();
                                                obspcelem["addNewItem"] = addNewItemHandler;
                                                rslt = obspcelem;
                                            }
                                        }
                                        catch (ex) {
                                            var wtf = true;
                                        }
                                        return rslt;
                                    };

                                    Enumerable.From(toCountablesColxn(optionset.countablesCount))
                                        .ForEach(function (countable, cndx) {
                                            rslt.push(toObsPCElem(countable, cndx));
                                        });
                                }
                                catch (ex) {
                                    var wtf = true;
                                }
                                return rslt;
                            };
                            var contentmodelcolxn = todefaulthtml(xoptionset);
                            pageentry.contentelements = contentmodelcolxn;
                            return contentmodelcolxn;
                        },
                        makepgobj: function (JSDat) {
                            var rslt = false;
                            try {
                                var obspcelemcolxn = pageentry.tohtml(JSDat.countables, JSDat.objectId, JSDat.datType);
                                pageentry.contentelements = obspcelemcolxn;//required for voteHander and updatePercents
                                //pageentry.pgobj().pcelemcolxn(obspcelemcolxn);//this populates the knockout viewmodel...with observable datContentElements
                                //obspcelemcolxn = null;
                                rslt = obspcelemcolxn;
                            }
                            catch (ex) {
                                alert("prweb.datwebplayersvc.pagentry.makepgobj type1 reports " + ex.Message);
                            }
                            return rslt;
                        },
                        tohtml: function (dcecolxn, datid, dattype) {
                            var rslt = [];
                            try {
                                var orderedDces = dcecolxn;//these have to ordered by their appearance in the DOM....
                                var totResp = Enumerable.From(dcecolxn).Sum(function (dce) { return dce.responseCount });
                                for (var n in orderedDces) {
                                    // Consider whether a dce might need to be more than only one row...maybe implies a 1:M between dce and obspcelem...
                                    // could also imply that multiple dces comprise one obspcelem....
                                    var presT = "dat125";//topresT(orderedDces[n]);//dcecolxn[n]//.modelcore.presenterT;
                                    var obspcelem = sps.observablemodelsvc.PCElemFromJSData(presT, orderedDces[n]);//PCElemFromJSData(dcecolxn[n]);//, pcmid);
                                    obspcelem.datid = datid;
                                    if (presT == 'dat125') {
                                        if (totResp == 0) {
                                            totResp = 1;
                                        }
                                        var mypct = (orderedDces[n].responseCount / totResp) * 100;
                                        var pctstr = ((Math.round(mypct * Math.pow(10, 1)) / Math.pow(10, 1)).toString() + '%');
                                        obspcelem.modelcore.responsePercent(pctstr);
                                        obspcelem.votehandler = pageentry.voteHandler;
                                    }
                                    obspcelem["seeStoryUrl"] = orderedDces[n].datElementText || false;
                                    // obspcelem.modelcore.html(sps.PCElemHtmlDxnry[presT].resourceModel);
                                    rslt.push(obspcelem);
                                };
                            }
                            catch (ex) {
                                alert("prweb.datwebplayersvc.pagentry.tohtml type 12 reports " + ex.Message);
                            }
                            return rslt;//is an array of observable pagecontentelements...
                        },
                        voteHandler: function (selectedCountable, dcelimid) {
                            //find the selectedCountable in jsdat and recompute the html
                            var objid = dcelimid || selectedCountable.modelcore.dcelementId;
                            var dcountable = Enumerable.From(pageentry.datObjectJs.countables).Where(function (x) {
                                return x.objectId == objid;
                            }).FirstOrDefault();
                            dcountable.responseCount += 1;
                            return pageentry.makepgobj(pageentry.datObjectJs);//this is the same as JSDat
                        },
                        updatePercents: function (dcelem, totresp) {
                        },
                    },
                    //#endregion datType 12
                    //#region datType 11
                    "11": {
                        makeEditpgobj: function (xoptionset) {
                            var toEdithtml = function (optionset) {
                                var rslt = [];
                                try {
                                    if (xoptionset["headerQuestionTextEditables"]) {
                                        var x = xoptionset["headerQuestionTextEditables"];
                                        var yes = true;
                                    }
                                    var singledatcomplete = optionset.iseditobj.singlepnldc.datcomplete;
                                    var singlecountables = singledatcomplete["countables"] || [];
                                    dattypeMethods.matchCountablesToJson(singlecountables, optionset.iseditobj["countableColxn"]);
                                    var toemojis = function (elementIndex) {
                                        var elemndx = "datEmoji" + ((elementIndex || 0) + 1);
                                        ordered[x]['emoji'] = prweb.toImgUrl(prweb.pCElemHtmlDxnry[elemndx].resourceFile);
                                    };
                                    var toCountablesColxn = function (cnt) {
                                        var toNewCntble = function (ndx) {
                                            var newcntble = {
                                                objectId: 0,
                                                isdatfiveeditaddnew: false,
                                                elementImage: prweb.toImgUrl(prweb.pCElemHtmlDxnry["datPhotoVideoIcon1"].resourceFile),
                                                elementimage: prweb.toImgUrl(prweb.pCElemHtmlDxnry["datPhotoVideoIcon1"].resourceFile),
                                                elementIndex: ndx,
                                                elementindex: ndx,
                                                countablesIndex: ndx,
                                                datElementText: ndx + " create new text here...",
                                                responseCount: 0,
                                                dispose: false
                                            }
                                            return newcntble;
                                        };
                                        return Enumerable.Range(0, cnt).Select(function (c) {
                                            return toNewCntble(c);
                                        }).ToArray();
                                    };
                                    var torespPctString = function (count, totresp) {
                                        var xcount = count || 0;
                                        var xtotresp = totresp || 1;
                                        var mypct = (xcount / xtotresp) * 100;
                                        return ((Math.round(mypct * Math.pow(10, 1)) / Math.pow(10, 1)).toString() + '%');
                                    };
                                    //var dcecolxn = toCountablesColxn(optionset.countablesCount);
                                    //var orderedDces = dcecolxn;//these have to ordered by their appearance in the DOM....
                                    var totResp = 0;//Enumerable.From(dcecolxn).Sum(function (dce) { return dce.responseCount });
                                    var addNewObsPCElem = function (colxnlength) {
                                        var countable = toCountablesColxn(1)[0];
                                        countable.elementIndex = colxnlength;
                                        return toObsPCElem(countable, colxnlength);
                                    };
                                    var addNewItemHandler = function (kodata, pnl, isautoadded) {
                                        //kodata is the obspcelem that was just tapped...
                                        //this method is called from the datFiveEdit1 tap handler...
                                        var newitem = {};
                                        try {
                                            var contentmodelcolxn = pnl["currentDatUniverseMember"].xcolxn;//pnl.contentmodelcolxn();
                                            newitem = addNewObsPCElem(contentmodelcolxn.length || 3);
                                            newitem["guid"] = newitem["guid"] || prweb.NewGuid();
                                            if (!isautoadded) {
                                                newitem["isdatfiveeditaddnew"](true);
                                                kodata["isdatfiveeditaddnew"](false);
                                                pnl["datSingleEditSvc"].addNewDat115(kodata, newitem);
                                            } else {
                                                var x = 1;
                                                return newitem;
                                                //returns newitem...
                                            }

                                        }
                                        catch (ex) {
                                            var wtf = true;
                                        }

                                        var yes = true;

                                    };
                                    var toObsPCElem = function (countable, cndx) {
                                        var rslt = {};
                                        try {
                                            var presT = "dat115";//topresT(orderedDces[n]);//dcecolxn[n]//.modelcore.presenterT;
                                            var obspcelem = sps.observablemodelsvc.PCElemFromJSData(presT, countable);
                                            obspcelem.datid = -1;
                                            obspcelem["guid"] = countable["guid"] || prweb.NewGuid();
                                            if (presT == 'dat115') {
                                                if (totResp == 0) {
                                                    totResp = 1;
                                                }
                                                var mypct = (countable.responseCount / totResp) * 100;
                                                var pctstr = ((Math.round(mypct * Math.pow(10, 1)) / Math.pow(10, 1)).toString() + '%');
                                                obspcelem.modelcore.responsePercent(pctstr);
                                                obspcelem.votehandler = pageentry.voteHandler;
                                                obspcelem["countablesIndex"] = cndx;
                                                obspcelem["countables"] = [countable];//orderedDces;
                                                obspcelem["winner"] = countable;//orderedDces[0];
                                                var islast = (optionset.countablesCount - 1) == cndx;
                                                obspcelem["isdatfiveeditaddnew"] = ko.observable(islast);
                                                if (countable["mainImageObject"]) {
                                                    obspcelem["mainImageObject"] = countable["mainImageObject"];
                                                    if (countable["mainImageObject"]["datImgId"]) {
                                                        obspcelem["isimagepopulated"] = ko.observable(true);
                                                        obspcelem.modelcore.elementImage = ko.observable(countable.elementImage);
                                                    } else {
                                                        obspcelem["isimagepopulated"] = ko.observable(false);
                                                    }
                                                } else {
                                                    obspcelem["isimagepopulated"] = ko.observable(false);
                                                    obspcelem["mainImageObject"] = { url: false, datImgId: false };
                                                }


                                                if (countable["linkedMediaObject"]) {
                                                    obspcelem["islinkedmediapopulated"] = ko.observable(true);
                                                    obspcelem["linkedMediaObject"] = ko.observable(countable["linkedMediaObject"]);
                                                } else {
                                                    obspcelem["islinkedmediapopulated"] = ko.observable(false);
                                                    obspcelem["linkedMediaObject"] = ko.observable(false);
                                                }
                                                obspcelem["verbatimResponseObject"] = ko.observable(false);
                                                obspcelem.modelcore.elementImage = ko.observable(countable.elementImage);
                                                obspcelem.modelcore["titleText"] = ko.observable(countable.titleText);
                                                var linkedmediaicon = prweb.pCElemHtmlDxnry["datLinkedMediaIcon1"].resourceFile.url();
                                                obspcelem["exposeLinkPasteArea"] = ko.observable(false);
                                                obspcelem.modelcore["linkedMediaIcon"] = ko.observable(linkedmediaicon);
                                                obspcelem.modelcore["seeStoryUrl"] = ko.observable();
                                                obspcelem["addNewItem"] = addNewItemHandler;
                                                rslt = obspcelem;
                                            }
                                        }
                                        catch (ex) {
                                            var wtf = true;
                                        }
                                        return rslt;
                                    };
                                    optionset.countablesCount = optionset.iseditobj["countableColxn"].length + 1;
                                    Enumerable.From(singlecountables)
                                        .ForEach(function (countable, cndx) {
                                            var toNewCntble = function (ndx) {
                                                var rslt = {
                                                    objectId: 0,
                                                    isdatfiveeditaddnew: false,
                                                    elementImage: prweb.toImgUrl(prweb.pCElemHtmlDxnry["datPhotoVideoIcon1"].resourceFile),
                                                    elementimage: prweb.toImgUrl(prweb.pCElemHtmlDxnry["datPhotoVideoIcon1"].resourceFile),
                                                    elementIndex: ndx,
                                                    elementindex: ndx,
                                                    countablesIndex: ndx,
                                                    titleText: "",
                                                    headerText: "",
                                                    datElementText: "",
                                                    responseCount: 0,
                                                    dispose: false
                                                }
                                                try {
                                                    rslt["objectId"] = countable["objectId"];
                                                    rslt['responseCount'] = countable['responseCount'];
                                                    if (countable["datJsonCntble"]) {
                                                        if (countable["datJsonCntble"]["linkedMediaObject"]) {
                                                            rslt["linkedMediaObject"] = countable["datJsonCntble"]["linkedMediaObject"];
                                                            Enumerable.From(["url"]).ForEach(function (p) {
                                                                //rslt[p] = countable[p];
                                                                var yes = true;
                                                            });
                                                            var yes = true;
                                                        }
                                                        if (countable["datJsonCntble"]["mainImageObject"]) {
                                                            rslt["elementImage"] = countable["datJsonCntble"]["mainImageObject"].url;
                                                            rslt["elementimage"] = countable["datJsonCntble"]["mainImageObject"].url;
                                                            rslt["mainImageObject"] = countable["datJsonCntble"]["mainImageObject"];
                                                            var yes = true;
                                                        }
                                                        if (countable["datJsonCntble"]["textEditables"]) {
                                                            rslt["textEditables"] = countable["datJsonCntble"]["textEditables"];
                                                            Enumerable.From(["titleText", "headerText", "datElementText"]).ForEach(function (p) {
                                                                rslt[p] = countable["datJsonCntble"]["textEditables"][p];
                                                            });
                                                            var yes = true;
                                                        }
                                                    } else {

                                                    }
                                                }
                                                catch (ex) {
                                                    var wtf = true;
                                                }
                                                return rslt;
                                            };
                                            rslt.push(toObsPCElem(toNewCntble(), cndx));
                                        });
                                    rslt.push(addNewObsPCElem(optionset.iseditobj["countableColxn"].length));
                                }
                                catch (ex) {
                                    var wtf = true;
                                }
                                return rslt;
                            };
                            var contentmodelcolxn = toEdithtml(xoptionset.datcomplete);
                            pageentry.contentelements = contentmodelcolxn;
                            return contentmodelcolxn;
                        },
                        makedefaultpgobj: function (xoptionset) {
                            var todefaulthtml = function (optionset) {
                                var rslt = [];
                                try {
                                    var toemojis = function (elementIndex) {
                                        var elemndx = "datEmoji" + ((elementIndex || 0) + 1);
                                        ordered[x]['emoji'] = prweb.toImgUrl(prweb.pCElemHtmlDxnry[elemndx].resourceFile);
                                    };
                                    var toCountablesColxn = function (cnt) {
                                        var toNewCntble = function (ndx) {
                                            var newcntble = {
                                                objectId: 0,
                                                isdatfiveeditaddnew: false,
                                                elementImage: prweb.toImgUrl(prweb.pCElemHtmlDxnry["datPhotoVideoIcon1"].resourceFile),
                                                elementimage: prweb.toImgUrl(prweb.pCElemHtmlDxnry["datPhotoVideoIcon1"].resourceFile),
                                                elementIndex: ndx,
                                                elementindex: ndx,
                                                countablesIndex: ndx,
                                                datElementText: ndx + " create new text here...",
                                                responseCount: 0,
                                                dispose: false
                                            }
                                            return newcntble;
                                        };
                                        return Enumerable.Range(0, cnt).Select(function (c) {
                                            return toNewCntble(c);
                                        }).ToArray();
                                    };
                                    var torespPctString = function (count, totresp) {
                                        var xcount = count || 0;
                                        var xtotresp = totresp || 1;
                                        var mypct = (xcount / xtotresp) * 100;
                                        return ((Math.round(mypct * Math.pow(10, 1)) / Math.pow(10, 1)).toString() + '%');
                                    };
                                    //var dcecolxn = toCountablesColxn(optionset.countablesCount);
                                    //var orderedDces = dcecolxn;//these have to ordered by their appearance in the DOM....
                                    var totResp = 0;//Enumerable.From(dcecolxn).Sum(function (dce) { return dce.responseCount });
                                    var addNewObsPCElem = function (colxnlength) {
                                        var countable = toCountablesColxn(1)[0];
                                        countable.elementIndex = colxnlength;
                                        return toObsPCElem(countable, colxnlength);
                                    };
                                    var addNewItemHandler = function (kodata, pnl, isautoadded) {
                                        //kodata is the obspcelem that was just tapped...
                                        //this method is called from the datFiveEdit1 tap handler...
                                        var newitem = {};
                                        try {
                                            var contentmodelcolxn = pnl["currentDatUniverseMember"].xcolxn;//pnl.contentmodelcolxn();
                                            newitem = addNewObsPCElem(contentmodelcolxn.length || 3);
                                            if (!isautoadded) {
                                                newitem["isdatfiveeditaddnew"](true);
                                                kodata["isdatfiveeditaddnew"](false);
                                                pnl["datSingleEditSvc"].addNewDat115(kodata, newitem);
                                            } else {
                                                var x = 1;
                                                return newitem;
                                                //returns newitem...
                                            }

                                        }
                                        catch (ex) {
                                            var wtf = true;
                                        }

                                        var yes = true;

                                    };
                                    var toObsPCElem = function (countable, cndx) {
                                        var rslt = {};
                                        try {
                                            var presT = "dat115";//topresT(orderedDces[n]);//dcecolxn[n]//.modelcore.presenterT;
                                            var obspcelem = sps.observablemodelsvc.PCElemFromJSData(presT, countable);
                                            obspcelem.datid = -1;
                                            obspcelem["guid"] = countable["guid"] || prweb.NewGuid();
                                            if (presT == 'dat115') {
                                                if (totResp == 0) {
                                                    totResp = 1;
                                                }
                                                var mypct = (countable.responseCount / totResp) * 100;
                                                var pctstr = ((Math.round(mypct * Math.pow(10, 1)) / Math.pow(10, 1)).toString() + '%');
                                                obspcelem.modelcore.responsePercent(pctstr);
                                                obspcelem.votehandler = pageentry.voteHandler;
                                                obspcelem["countablesIndex"] = cndx;
                                                obspcelem["countables"] = [countable];//orderedDces;
                                                obspcelem["winner"] = countable;//orderedDces[0];
                                                var islast = (optionset.countablesCount - 1) == cndx;
                                                obspcelem["isdatfiveeditaddnew"] = ko.observable(islast);
                                                obspcelem["isimagepopulated"] = ko.observable(false);
                                                obspcelem["islinkedmediapopulated"] = ko.observable(false);
                                                obspcelem["linkedMediaObject"] = ko.observable(false);
                                                obspcelem["mainImageObject"] = { url: false, datImgId: false };
                                                obspcelem["verbatimResponseObject"] = ko.observable(false);
                                                obspcelem.modelcore.elementImage = ko.observable(countable.elementImage);
                                                obspcelem.modelcore["titleText"] = ko.observable();
                                                var linkedmediaicon = prweb.pCElemHtmlDxnry["datLinkedMediaIcon1"].resourceFile.url();
                                                obspcelem.modelcore["linkedMediaIcon"] = ko.observable(linkedmediaicon);
                                                obspcelem["exposeLinkPasteArea"] = ko.observable(false);
                                                obspcelem.modelcore["seeStoryUrl"] = ko.observable();
                                                obspcelem["addNewItem"] = addNewItemHandler;
                                                rslt = obspcelem;
                                            }
                                        }
                                        catch (ex) {
                                            var wtf = true;
                                        }
                                        return rslt;
                                    };

                                    Enumerable.From(toCountablesColxn(optionset.countablesCount))
                                        .ForEach(function (countable, cndx) {
                                            rslt.push(toObsPCElem(countable, cndx));
                                        });
                                }
                                catch (ex) {
                                    var wtf = true;
                                }
                                return rslt;
                            };
                            var contentmodelcolxn = todefaulthtml(xoptionset);
                            pageentry.contentelements = contentmodelcolxn;
                            return contentmodelcolxn;
                        },
                        makepgobj: function (JSDat) {
                            var rslt = false;
                            try {
                                var obspcelemcolxn = pageentry.tohtml(JSDat.countables, JSDat.objectId, JSDat.datType);
                                pageentry.contentelements = obspcelemcolxn;//required for voteHander and updatePercents
                                //pageentry.pgobj().pcelemcolxn(obspcelemcolxn);//this populates the knockout viewmodel...with observable datContentElements
                                //obspcelemcolxn = null;
                                rslt = obspcelemcolxn;
                            }
                            catch (ex) {
                                alert("prweb.datwebplayersvc.pagentry.makepgobj type1 reports " + ex.Message);
                            }
                            return rslt;
                        },
                        tohtml: function (dcecolxn, datid, dattype) {
                            var rslt = [];
                            try {
                                var orderedDces = dcecolxn;//these have to ordered by their appearance in the DOM....
                                var totResp = Enumerable.From(dcecolxn).Sum(function (dce) {
                                    return dce.responseCount
                                });
                                for (var n in orderedDces) {
                                    // Consider whether a dce might need to be more than only one row...maybe implies a 1:M between dce and obspcelem...
                                    // could also imply that multiple dces comprise one obspcelem....
                                    var presT = "dat115";//topresT(orderedDces[n]);//dcecolxn[n]//.modelcore.presenterT;
                                    var obspcelem = sps.observablemodelsvc.PCElemFromJSData(presT, orderedDces[n]);//PCElemFromJSData(dcecolxn[n]);//, pcmid);
                                    obspcelem.datid = datid;
                                    if (presT == 'dat115') {
                                        if (totResp == 0) {
                                            totResp = 1;
                                        }
                                        var mypct = (orderedDces[n].responseCount / totResp) * 100;
                                        var pctstr = ((Math.round(mypct * Math.pow(10, 1)) / Math.pow(10, 1)).toString() + '%');
                                        obspcelem.modelcore.responsePercent(pctstr);
                                        obspcelem.votehandler = pageentry.voteHandler;
                                    }
                                    if (orderedDces[n]["datJsonCntble"]) {
                                        if (orderedDces[n]["datJsonCntble"]["mainImageObject"]) {
                                            obspcelem.modelcore["elementImage"] = orderedDces[n]["datJsonCntble"]["mainImageObject"].url;
                                            obspcelem.modelcore["elementimage"] = orderedDces[n]["datJsonCntble"]["mainImageObject"].url;
                                            obspcelem.modelcore["mainImageObject"] = orderedDces[n]["datJsonCntble"]["mainImageObject"];
                                            var yes = true;
                                        }
                                    } else {
                                        var istherjsonmodel = "hmmm";
                                    }
                                    
                                    obspcelem["seeStoryUrl"] = orderedDces[n].datElementText || false;
                                    obspcelem["headerText"] = orderedDces[n].titleText || orderedDces[n].headerText || false;
                                    //obspcelem.modelcore.elementImage = ko.observable(orderedDces[n].elementImage);
                                    // obspcelem.modelcore.html(sps.PCElemHtmlDxnry[presT].resourceModel);
                                    rslt.push(obspcelem);
                                };
                            }
                            catch (ex) {
                                alert("prweb.datwebplayersvc.pagentry.tohtml type 11 reports " + ex.Message);
                            }
                            return rslt;//is an array of observable pagecontentelements...
                        },
                        voteHandler: function (selectedCountable, dcelimid) {
                            return true
                        },
                        updatePercents: function (dcelem, totresp) {
                        },
                    },
                    //#endregion datType11
                    //#region datType 1
                    "1": {
                        makeEditpgobj: function (xoptionset) {
                            var toEdithtml = function (optionset) {
                                var rslt = [];
                                try {
                                    if (xoptionset["headerQuestionTextEditables"]) {
                                        var x = xoptionset["headerQuestionTextEditables"];
                                        var yes = true;
                                    }
                                    var singledatcomplete = optionset.iseditobj.singlepnldc.datcomplete;
                                    var singlecountables = singledatcomplete["countables"] || [];
                                    dattypeMethods.matchCountablesToJson(singlecountables, optionset.iseditobj["countableColxn"]);
                                    var toemojis = function (elementIndex) {
                                        var elemndx = "datEmoji" + ((elementIndex || 0) + 1);
                                        ordered[x]['emoji'] = prweb.toImgUrl(prweb.pCElemHtmlDxnry[elemndx].resourceFile);
                                    };
                                    var toCountablesColxn = function (cnt) {
                                        var toNewCntble = function (ndx) {
                                            var newcntble = {
                                                objectId: 0,
                                                isdatfiveeditaddnew: false,
                                                elementImage: prweb.toImgUrl(prweb.pCElemHtmlDxnry["datPhotoVideoIcon1"].resourceFile),
                                                elementimage: prweb.toImgUrl(prweb.pCElemHtmlDxnry["datPhotoVideoIcon1"].resourceFile),
                                                elementIndex: ndx,
                                                elementindex: ndx,
                                                countablesIndex: ndx,
                                                datElementText: ndx + " create new text here...",
                                                responseCount: 0,
                                                dispose: false
                                            }
                                            return newcntble;
                                        };
                                        return Enumerable.Range(0, cnt).Select(function (c) {
                                            return toNewCntble(c);
                                        }).ToArray();
                                    };
                                    var torespPctString = function (count, totresp) {
                                        var xcount = count || 0;
                                        var xtotresp = totresp || 1;
                                        var mypct = (xcount / xtotresp) * 100;
                                        return ((Math.round(mypct * Math.pow(10, 1)) / Math.pow(10, 1)).toString() + '%');
                                    };
                                    //var dcecolxn = toCountablesColxn(optionset.countablesCount);
                                    //var orderedDces = dcecolxn;//these have to ordered by their appearance in the DOM....
                                    var totResp = 0;//Enumerable.From(dcecolxn).Sum(function (dce) { return dce.responseCount });
                                    var addNewObsPCElem = function (colxnlength) {
                                        var countable = toCountablesColxn(1)[0];
                                        countable.elementIndex = colxnlength;
                                        return toObsPCElem(countable, colxnlength);
                                    };
                                    var addNewItemHandler = function (kodata, pnl, isautoadded) {
                                        //kodata is the obspcelem that was just tapped...
                                        //this method is called from the datFiveEdit1 tap handler...
                                        var newitem = {};
                                        try {
                                            var contentmodelcolxn = pnl["currentDatUniverseMember"].xcolxn;//pnl.contentmodelcolxn();
                                            newitem = addNewObsPCElem(contentmodelcolxn.length || 3);
                                            newitem["guid"] = newitem["guid"] || prweb.NewGuid();
                                            if (!isautoadded) {
                                                newitem["isdatfiveeditaddnew"](true);
                                                kodata["isdatfiveeditaddnew"](false);
                                                pnl["datSingleEditSvc"].addNewDatFive(kodata, newitem);
                                            } else {
                                                var x = 1;
                                                return newitem;
                                                //returns newitem...
                                            }

                                        }
                                        catch (ex) {
                                            var wtf = true;
                                        }

                                        var yes = true;

                                    };
                                    var toObsPCElem = function (countable, cndx) {
                                        var rslt = {};
                                        try {
                                            var presT = "dat5";//topresT(orderedDces[n]);//dcecolxn[n]//.modelcore.presenterT;
                                            var obspcelem = sps.observablemodelsvc.PCElemFromJSData(presT, countable);
                                            obspcelem.datid = -1;
                                            obspcelem["guid"] = countable["guid"] || prweb.NewGuid();
                                            if (presT == 'dat5') {
                                                obspcelem["guid"] = countable["guid"] || prweb.NewGuid();
                                                if (totResp == 0) {
                                                    totResp = 1;
                                                }
                                                var mypct = (countable.responseCount / totResp) * 100;
                                                var pctstr = ((Math.round(mypct * Math.pow(10, 1)) / Math.pow(10, 1)).toString() + '%');
                                                obspcelem.modelcore.responsePercent(pctstr);
                                                obspcelem.votehandler = pageentry.voteHandler;
                                                obspcelem["countablesIndex"] = cndx;
                                                obspcelem["countables"] = [countable];//orderedDces;
                                                obspcelem["winner"] = countable;//orderedDces[0];
                                                var islast = (optionset.countablesCount - 1) == cndx;
                                                obspcelem["isdatfiveeditaddnew"] = ko.observable(islast);
                                                if (countable["mainImageObject"]) {
                                                    obspcelem["mainImageObject"] = countable["mainImageObject"];
                                                    if (countable["mainImageObject"]["datImgId"]) {
                                                        obspcelem["isimagepopulated"] = ko.observable(true);
                                                    } else {
                                                        obspcelem["isimagepopulated"] = ko.observable(false);
                                                    }
                                                } else {
                                                    obspcelem["isimagepopulated"] = ko.observable(false);
                                                    obspcelem["mainImageObject"] = { url: false, datImgId: false };
                                                }


                                                if (countable["linkedMediaObject"]) {
                                                    obspcelem["islinkedmediapopulated"] = ko.observable(true);
                                                    obspcelem["linkedMediaObject"] = ko.observable(countable["linkedMediaObject"]);
                                                } else {
                                                    obspcelem["islinkedmediapopulated"] = ko.observable(false);
                                                    obspcelem["linkedMediaObject"] = ko.observable(false);
                                                }
                                                obspcelem["verbatimResponseObject"] = ko.observable(false);
                                                obspcelem.modelcore.elementImage = ko.observable(countable.elementImage);
                                                obspcelem.modelcore["titleText"] = ko.observable(countable.titleText);
                                                var linkedmediaicon = prweb.pCElemHtmlDxnry["datLinkedMediaIcon1"].resourceFile.url();
                                                obspcelem["exposeLinkPasteArea"] = ko.observable(false);
                                                obspcelem.modelcore["linkedMediaIcon"] = ko.observable(linkedmediaicon);
                                                obspcelem.modelcore["seeStoryUrl"] = ko.observable();
                                                obspcelem["addNewItem"] = addNewItemHandler;
                                                rslt = obspcelem;
                                            }
                                        }
                                        catch (ex) {
                                            var wtf = true;
                                        }
                                        return rslt;
                                    };
                                    optionset.countablesCount = optionset.iseditobj["countableColxn"].length + 1;
                                    Enumerable.From(singlecountables)
                                        .ForEach(function (countable, cndx) {
                                            var toNewCntble = function (ndx) {
                                                var rslt = {
                                                    objectId: 0,
                                                    isdatfiveeditaddnew: false,
                                                    elementImage: prweb.toImgUrl(prweb.pCElemHtmlDxnry["datPhotoVideoIcon1"].resourceFile),
                                                    elementimage: prweb.toImgUrl(prweb.pCElemHtmlDxnry["datPhotoVideoIcon1"].resourceFile),
                                                    elementIndex: ndx,
                                                    elementindex: ndx,
                                                    countablesIndex: ndx,
                                                    titleText: "",
                                                    headerText: "",
                                                    datElementText: "",
                                                    responseCount: 0,
                                                    dispose: false
                                                }
                                                try {
                                                    rslt["objectId"] = countable["objectId"];
                                                    rslt['responseCount'] = countable['responseCount'];
                                                    if (countable["datJsonCntble"]) {
                                                        if (countable["datJsonCntble"]["linkedMediaObject"]) {
                                                            rslt["linkedMediaObject"] = countable["datJsonCntble"]["linkedMediaObject"];
                                                            Enumerable.From(["url"]).ForEach(function (p) {
                                                                //rslt[p] = countable[p];
                                                                var yes = true;
                                                            });
                                                            var yes = true;
                                                        }
                                                        if (countable["datJsonCntble"]["mainImageObject"]) {
                                                            rslt["elementImage"] = countable["datJsonCntble"]["mainImageObject"].url;
                                                            rslt["elementimage"] = countable["datJsonCntble"]["mainImageObject"].url;
                                                            rslt["mainImageObject"] = countable["datJsonCntble"]["mainImageObject"];
                                                            var yes = true;
                                                        }
                                                        if (countable["datJsonCntble"]["textEditables"]) {
                                                            rslt["textEditables"] = countable["datJsonCntble"]["textEditables"];
                                                            Enumerable.From(["titleText", "headerText", "datElementText"]).ForEach(function (p) {
                                                                rslt[p] = countable["datJsonCntble"]["textEditables"][p];
                                                            });
                                                            var yes = true;
                                                        }
                                                    } else { }
                                                }
                                                catch (ex) {
                                                    var wtf = true;
                                                }
                                                return rslt;
                                            };
                                            rslt.push(toObsPCElem(toNewCntble(), cndx));
                                        });
                                    rslt.push(addNewObsPCElem(optionset.iseditobj["countableColxn"].length));
                                }
                                catch (ex) {
                                    var wtf = true;
                                }
                                return rslt;
                            };
                            var contentmodelcolxn = toEdithtml(xoptionset.datcomplete);
                            pageentry.contentelements = contentmodelcolxn;
                            return contentmodelcolxn;
                        },
                        makedefaultpgobj: function (xoptionset) {
                            var todefaulthtml = function (optionset) {
                                var rslt = [];
                                try { 
                                var toemojis = function (elementIndex) {
                                    var elemndx = "datEmoji" + ((elementIndex || 0) + 1);
                                    ordered[x]['emoji'] = prweb.toImgUrl(prweb.pCElemHtmlDxnry[elemndx].resourceFile);
                                };
                                var toCountablesColxn = function (cnt) {
                                    var toNewCntble = function (ndx) {
                                        var newcntble = {
                                            objectId: 0,
                                            isdatfiveeditaddnew: false,
                                            elementImage: prweb.toImgUrl(prweb.pCElemHtmlDxnry["datPhotoVideoIcon1"].resourceFile),
                                            elementimage: prweb.toImgUrl(prweb.pCElemHtmlDxnry["datPhotoVideoIcon1"].resourceFile),
                                            elementIndex: ndx,
                                            elementindex: ndx,
                                            countablesIndex: ndx,
                                            datElementText: ndx + " create new text here...",
                                            responseCount: 0,
                                            dispose: false
                                        }
                                        return newcntble;
                                    };
                                    return Enumerable.Range(0, cnt).Select(function (c) {
                                        return toNewCntble(c);
                                    }).ToArray();
                                };
                                var torespPctString = function (count, totresp) {
                                    var xcount = count || 0;
                                    var xtotresp = totresp || 1;
                                    var mypct = (xcount / xtotresp) * 100;
                                    return ((Math.round(mypct * Math.pow(10, 1)) / Math.pow(10, 1)).toString() + '%');
                                };
                                //var dcecolxn = toCountablesColxn(optionset.countablesCount);
                                //var orderedDces = dcecolxn;//these have to ordered by their appearance in the DOM....
                                var totResp = 0;//Enumerable.From(dcecolxn).Sum(function (dce) { return dce.responseCount });
                                var addNewObsPCElem = function (colxnlength) {
                                    var countable = toCountablesColxn(1)[0];
                                    countable.elementIndex = colxnlength;
                                    return toObsPCElem(countable, colxnlength);
                                };
                                var addNewItemHandler = function (kodata, pnl, isautoadded) {
                                    //kodata is the obspcelem that was just tapped...
                                    //this method is called from the datFiveEdit1 tap handler...
                                    var newitem = {};
                                    try {
                                        var contentmodelcolxn = pnl["currentDatUniverseMember"].xcolxn;//pnl.contentmodelcolxn();
                                        newitem = addNewObsPCElem(contentmodelcolxn.length || 3);
                                        if (!isautoadded) {
                                            newitem["isdatfiveeditaddnew"](true);
                                            kodata["isdatfiveeditaddnew"](false);
                                            pnl["datSingleEditSvc"].addNewDatFive(kodata, newitem);
                                        } else {
                                            var x = 1;
                                            return newitem;
                                            //returns newitem...
                                        }
                                        
                                    }
                                    catch (ex) {
                                        var wtf = true;
                                    }
                                    
                                    var yes = true;
                                    
                                };
                                var toObsPCElem = function (countable, cndx) {
                                    var rslt = {};
                                    try {
                                        var presT = "dat5";//topresT(orderedDces[n]);//dcecolxn[n]//.modelcore.presenterT;
                                        var obspcelem = sps.observablemodelsvc.PCElemFromJSData(presT, countable);
                                        obspcelem.datid = -1;
                                        obspcelem["guid"] = countable["guid"] || prweb.NewGuid();
                                        if (presT == 'dat5') {
                                            if (totResp == 0) {
                                                totResp = 1;
                                            }
                                            var mypct = (countable.responseCount / totResp) * 100;
                                            var pctstr = ((Math.round(mypct * Math.pow(10, 1)) / Math.pow(10, 1)).toString() + '%');
                                            obspcelem.modelcore.responsePercent(pctstr);
                                            obspcelem.votehandler = pageentry.voteHandler;
                                            obspcelem["countablesIndex"] = cndx;
                                            obspcelem["countables"] = [countable];//orderedDces;
                                            obspcelem["winner"] = countable;//orderedDces[0];
                                            var islast = (optionset.countablesCount - 1) == cndx;
                                            obspcelem["isdatfiveeditaddnew"] = ko.observable(islast);
                                            obspcelem["isimagepopulated"] = ko.observable(false);
                                            obspcelem["islinkedmediapopulated"] = ko.observable(false);
                                            obspcelem["linkedMediaObject"] = ko.observable(false);
                                            obspcelem["mainImageObject"] = { url: false, datImgId: false };
                                            obspcelem["verbatimResponseObject"] = ko.observable(false);
                                            obspcelem.modelcore.elementImage = ko.observable(countable.elementImage);
                                            obspcelem.modelcore["titleText"] = ko.observable();
                                            var linkedmediaicon = prweb.pCElemHtmlDxnry["datLinkedMediaIcon1"].resourceFile.url();
                                            obspcelem["exposeLinkPasteArea"] = ko.observable(false);
                                            obspcelem.modelcore["linkedMediaIcon"] = ko.observable(linkedmediaicon);
                                            obspcelem.modelcore["seeStoryUrl"] = ko.observable();
                                            obspcelem["addNewItem"] = addNewItemHandler;
                                            rslt = obspcelem;
                                        }
                                    }
                                    catch (ex) {
                                        var wtf = true;
                                    }
                                    return rslt;
                                };
                                
                                Enumerable.From(toCountablesColxn(optionset.countablesCount))
                                    .ForEach(function (countable, cndx) {
                                        rslt.push(toObsPCElem(countable, cndx));
                                    });
                                }
                                catch (ex) {
                                    var wtf = true;
                                }
                                return rslt;
                            };
                            var contentmodelcolxn = todefaulthtml(xoptionset);
                            pageentry.contentelements = contentmodelcolxn;
                            return contentmodelcolxn;
                        },
                        makepgobj:function (JSDat) {
                            var rslt = false;
                            try {
                                var obspcelemcolxn = pageentry.tohtml(JSDat.countables, JSDat.objectId, JSDat.datType);
                                pageentry.contentelements = obspcelemcolxn;//required for voteHander and updatePercents
                                //pageentry.pgobj().pcelemcolxn(obspcelemcolxn);//this populates the knockout viewmodel...with observable datContentElements
                                //obspcelemcolxn = null;
                                rslt = obspcelemcolxn;
                            }
                            catch (ex) {
                                alert("prweb.datwebplayersvc.pagentry.makepgobj type1 reports " + ex.Message);
                            }
                            return rslt;
                        }, 
                        tohtml: function (dcecolxn, datid, dattype) {
                            var rslt = [];
                            try {
                                var orderedDces = dcecolxn;//these have to ordered by their appearance in the DOM....
                                var totResp = Enumerable.From(dcecolxn).Sum(function (dce) { return dce.responseCount });
                                for (var n in orderedDces) {
                                    // Consider whether a dce might need to be more than only one row...maybe implies a 1:M between dce and obspcelem...
                                    // could also imply that multiple dces comprise one obspcelem....
                                    var presT = "dat5";//topresT(orderedDces[n]);//dcecolxn[n]//.modelcore.presenterT;
                                    var obspcelem = sps.observablemodelsvc.PCElemFromJSData(presT, orderedDces[n]);//PCElemFromJSData(dcecolxn[n]);//, pcmid);
                                    obspcelem.datid = datid;
                                    if (presT == 'dat5') {
                                        if (totResp == 0) {
                                            totResp = 1;
                                        }
                                        var mypct = (orderedDces[n].responseCount / totResp) * 100;
                                        var pctstr = ((Math.round(mypct * Math.pow(10, 1)) / Math.pow(10, 1)).toString() + '%');
                                        obspcelem.modelcore.responsePercent(pctstr);
                                        obspcelem.votehandler = pageentry.voteHandler;
                                    }
                                    obspcelem["seeStoryUrl"] = orderedDces[n].datElementText || false;
                                    // obspcelem.modelcore.html(sps.PCElemHtmlDxnry[presT].resourceModel);
                                    rslt.push(obspcelem);
                                };
                            }
                            catch (ex) {
                                alert("prweb.datwebplayersvc.pagentry.tohtml type 1 reports " + ex.Message);
                            }
                            return rslt;//is an array of observable pagecontentelements...
                        },
                        voteHandler: function (selectedCountable, dcelimid) {
                            //find the selectedCountable in jsdat and recompute the html
                            var objid = dcelimid || selectedCountable.modelcore.dcelementId;
                            var dcountable = Enumerable.From(pageentry.datObjectJs.countables).Where(function (x) {
                                return x.objectId == objid;
                            }).FirstOrDefault();
                            dcountable.responseCount += 1;
                            return pageentry.makepgobj(pageentry.datObjectJs);//this is the same as JSDat
                        },
                        updatePercents: function (dcelem, totresp) {
                            //var mypct = (dcelem.modelcore.responseCount() / totresp) * 100;
                            //var pctstr = ((Math.round(mypct * Math.pow(10, 1)) / Math.pow(10, 1)).toString() + '%');
                            //dcelem.modelcore.responsePercent(pctstr);
                            //var datcomplete = pageentry.datObjectJs;
                            //var datdce = Enumerable.From(datcomplete.dcecolxn).Where(function (dce) { return dce.objectId == dcelem.modelcore.dcelementId }).FirstOrDefault();
                            //return true;
                        },
                        dispose: false
                    },
                    //#endregion
                    //#region datType 2
                    "2": {
                        makeEditpgobj: function (xoptionset) {
                            var toEdithtml = function (optionset) {
                                var rslt = [];
                                try {
                                    //var toemojis = function (elementIndex) {
                                    //    var elemndx = "datEmoji" + ((elementIndex || 0) + 1);
                                    //    ordered[x]['emoji'] = prweb.toImgUrl(prweb.pCElemHtmlDxnry[elemndx].resourceFile);
                                    //};
                                    var toCountablesColxn = function (cnt) {
                                        var todatelemtext = function (count, newcountable, ndx) {
                                            var rslt = "";
                                            try {
                                                var caption = ko.unwrap(optionset["datcountableitemVmx"]["ratecaptioncolxn"][ndx - 1]["datElementText"]);
                                                newcountable.datElementText = caption;//optionset["captioncolxn"][ndx]["datElementText"];
                                            }
                                            catch (ex) {
                                                var wtf = true;
                                            }
                                            return rslt;
                                        };
                                        var toNewCntble = function (ndx, cntble) {
                                            var newcntble = {
                                                objectId: cntble.objectId,
                                                elemementImage: "",
                                                elementimage: "",
                                                elementIndex: ndx,
                                                elementindex: ndx,
                                                datElementText: "",
                                                responseCount: 0,
                                                dispose: false
                                            }
                                            if (cnt == 3) {
                                                //newcntble.elementIndex = ndx - 1;
                                                //newcntble.elementindex = ndx - 1;
                                                var whatisndx = newcntble.elementIndex;
                                            }
                                            return newcntble;
                                        };
                                        return Enumerable.From(optionset.countables).Select(function (cntble, ndx) {
                                            var newc = toNewCntble(ndx + 1, cntble);
                                            todatelemtext(cnt, newc, ndx + 1);
                                            return newc;
                                        }).ToArray();
                                        //return Enumerable.Range(1, cnt).Select(function (c) {
                                        //    var newc = toNewCntble(c);
                                        //    todatelemtext(cnt, newc, c);
                                        //    return newc;
                                        //}).ToArray();
                                    };
                                    //#region ordercountables
                                    var ordercountables = function (colxn, respcount) {
                                        //#region rateType functions
                                        var rateType = {
                                            3: function (ordX) {
                                                ordX["isFace"] = true;
                                                ordX["isStar"] = false;
                                                ordX["isCircle"] = false;
                                                ordX["divVisible"] = false;
                                                ordX["imgVisible"] = true;
                                                //ordX['emoji'] = '';
                                                var elemndx = "datFace" + ((ordX["elementIndex"] || 0) + 0);
                                                ordX['emoji'] = prweb.pCElemHtmlDxnry[elemndx].resourceFile.url() || prweb.pCElemHtmlDxnry[elemndx].resourceFile.url;
                                            },
                                            5: function (ordX) {
                                                ordX["isFace"] = false;
                                                ordX["isStar"] = true;
                                                ordX["isCircle"] = false;
                                                ordX["divVisible"] = true;
                                                ordX["imgVisible"] = false;
                                                ordX['emoji'] = '';
                                                //ordX['emoji'] = prweb.pCElemHtmlDxnry["datEmoji7"].resourceFile.url;
                                            },
                                            10: function (ordX) {
                                                ordX["isFace"] = false;
                                                ordX["isStar"] = false;
                                                ordX["isCircle"] = true;
                                                ordX["divVisible"] = true;
                                                ordX["imgVisible"] = false;
                                                ordX['emoji'] = '';
                                                //ordX['emoji'] = prweb.pCElemHtmlDxnry["datEmoji9"].resourceFile.url;
                                            }
                                        };
                                        //#endregion rateType functions
                                        var rslt = [];
                                        var ndxs = [];
                                        if (colxn.length == 3) {
                                            //#region faces
                                            ndxs = [0, 1, 2];
                                            var ordered = colxn;//Enumerable.From(colxn).OrderByDescending(function (x) { return x.responseCount }).ToArray();
                                            Enumerable.From(ndxs).ForEach(function (x) {
                                                if (x == 1) {
                                                    ordered[x]["isFaceWinner"] = true;
                                                } else {
                                                    ordered[x]["isFaceWinner"] = false;
                                                }

                                                ordered[x]["isStarWinner"] = false;
                                                ordered[x]["isStarEmpty"] = false;
                                                ordered[x]["isCircleWinner"] = false;
                                                ordered[x]["circleBackground"] = "rgba(255, 255, 255, 0)";
                                                ordered[x]['responsePercent'] = torespPctString(ordered[x].responseCount, respcount);
                                                ordered[x]["circleNumber"] = 0;
                                                rateType[colxn.length](ordered[x]);
                                                rslt.push(ordered[x]);
                                            });
                                            //#endregion faces
                                        } else if (colxn.length == 5) {
                                            //#region stars
                                            ndxs = [0, 1, 2, 3, 4];
                                            var ordered = Enumerable.From(colxn).OrderBy(function (x) { return x.elementIndex }).ToArray();
                                            var weightedCum = Enumerable.From(ndxs).Sum(function (x) { return ordered[x].responseCount * (x + 1); });
                                            var avg = weightedCum / respcount;
                                            if (pageentry.displaymode) {
                                                avg = pageentry.displaymode.countable.elementIndex + 1;
                                                var yes = true;
                                            }
                                            Enumerable.From(ndxs).ForEach(function (x) {
                                                if ((x + 1) <= avg) {
                                                    ordered[x]["isStarWinner"] = true;
                                                    ordered[x]["isStarEmpty"] = false;
                                                } else {
                                                    ordered[x]["isStarEmpty"] = true;
                                                    ordered[x]["isStarWinner"] = false;
                                                }
                                                ordered[x]['responsePercent'] = "";
                                                ordered[x]["isFaceWinner"] = false;
                                                ordered[x]["isCircleWinner"] = false;
                                                ordered[x]["circleBackground"] = "rgba(255, 255, 255, 0)";
                                                ordered[x]["circleNumber"] = 0;
                                                rateType[colxn.length](ordered[x]);
                                                rslt.push(ordered[x]);
                                            });
                                            //#endregion stars
                                        } else if (colxn.length == 10) {
                                            //#region circles
                                            var backcolors = {
                                                0: "rgba(40, 163, 236, 1)",
                                                1: "rgba(0, 150, 206, 1)",
                                                2: "rgba(0, 134, 156, 1)",
                                                3: "rgba(0, 124, 180, 1)",
                                                4: "rgba(0, 114, 206, 1)",
                                                5: "rgba(103, 113, 206, 1)",
                                                6: "rgba(81, 79, 206, 1)",
                                                7: "rgba(165, 60, 168, 1)",
                                                8: "rgba(206, 52, 81, 1)",
                                                9: "rgba(196, 41, 72, 1)",
                                                dispose: false
                                            }
                                            ndxs = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
                                            var ordered = Enumerable.From(colxn).OrderBy(function (x) { return x.elementIndex }).ToArray();
                                            var weightedCum = Enumerable.From(ndxs).Sum(function (x) { return ordered[x].responseCount * (x + 1); });
                                            var xrespcount = respcount || 1;
                                            var avg = Math.round(weightedCum / xrespcount);
                                            if (pageentry.displaymode) {
                                                avg = pageentry.displaymode.countable.elementIndex + 1;
                                                var yes = true;
                                            }
                                            Enumerable.From(ndxs).ForEach(function (x) {
                                                if ((x + 1) == avg) {
                                                    ordered[x]["isCircleWinner"] = true;
                                                    ordered[x]["circleBackground"] = "rgba(255, 180, 14, 1)";
                                                } else {
                                                    ordered[x]["isCircleWinner"] = false;
                                                    ordered[x]["circleBackground"] = backcolors[x] || "rgba(255, 17, 255, 1)";
                                                }
                                                ordered[x]["isFaceWinner"] = false;
                                                ordered[x]['responsePercent'] = "";
                                                ordered[x]["circleNumber"] = x + 1;
                                                ordered[x]["isStarWinner"] = false;
                                                ordered[x]["isStarEmpty"] = false;
                                                rateType[colxn.length](ordered[x]);
                                                rslt.push(ordered[x]);
                                            });
                                        }
                                        //#endregion stars

                                        return rslt;
                                    };
                                    //#endregion ordercountables
                                    var torespPctString = function (count, totresp) {
                                        var xcount = count || 0;
                                        var xtotresp = totresp || 1;
                                        var mypct = (xcount / xtotresp) * 100;
                                        return ((Math.round(mypct * Math.pow(10, 1)) / Math.pow(10, 1)).toString() + '%');
                                    };
                                    var buildcaptioncolxn = function (colxn) {
                                        var rslt = Enumerable.From(colxn).Where(function (c) { return c.datElementText != ""; }).Select(function (c) {
                                            return {
                                                colmx: ko.observable(4),
                                                alignment: ko.observable("textcenter"),
                                                datElementText: ko.observable(c.datElementText),
                                                responsePercent: ko.observable(c.responsePercent || "0%"),
                                                isFaceWinner: ko.observable(false)
                                            };
                                        }).ToArray();

                                        if (rslt.length > 0) {
                                            var xcol = 6;
                                            xcol = 12 / rslt.length;
                                            if (colxn.length == 10 || colxn.length == 5) {
                                                rslt[0].alignment("textleft");
                                                rslt[0].colmx(xcol);
                                                rslt[rslt.length - 1].alignment("textright");
                                                rslt[rslt.length - 1].colmx(xcol);
                                            }
                                        }

                                        return rslt;
                                    };
                                    var presT = "datRate1";
                                    var row = pageentry.tomodelcore(presT);
                                    //row["countableColxn"] = toCountablesColxn(optionset.countablesCount);
                                    row["datcomplete"] = xoptionset;
                                    row["datcomplete"]["countables"] = toCountablesColxn(optionset.countablesCount);
                                    row["countableColxn"] = ordercountables(row["datcomplete"]["countables"]);
                                    row["mainImage"] = ko.observable(optionset.otherdcelems[0].elementImage);
                                    row["seeStoryUrl"] = optionset.otherdcelems[0].datElementText || false;
                                    row["responseCount"] = Enumerable.From(row["datcomplete"]["countables"]).Sum(function (dce) { return dce.responseCount });
                                    row["is3column"] = optionset.countablesCount == 3;
                                    row["is5column"] = optionset.countablesCount == 5;
                                    row["is10column"] = optionset.countablesCount == 10;
                                    row["is5or10column"] = optionset.countablesCount == 10 || optionset.countablesCount == 5;

                                    row["ratecaptioncolxn"] = buildcaptioncolxn(row["countableColxn"]);
                                    row["rateeditcaptioncolxn"] = row["ratecaptioncolxn"];
                                    if (row["is3column"]) {
                                        if (row["ratecaptioncolxn"].length == 3) {
                                            row["ratecaptioncolxn"][1]["isFaceWinner"](true);
                                        }
                                    }
                                    var linkedmediaicon = prweb.pCElemHtmlDxnry["datLinkedMediaIcon1"].resourceFile.url();
                                    row.modelcore["linkedMediaIcon"] = ko.observable(linkedmediaicon);
                                    row["exposeLinkPasteArea"] = ko.observable(false);
                                    if (optionset.datJsonModel["mainImageObject"]) {
                                        row["mainImageObject"] = optionset.datJsonModel["mainImageObject"];
                                        if (optionset.datJsonModel["mainImageObject"]["datImgId"]) {
                                            row["isimagepopulated"] = ko.observable(true);
                                        } else {
                                            row["isimagepopulated"] = ko.observable(false);
                                        }
                                    } else {
                                        row["isimagepopulated"] = ko.observable(false);
                                        row["mainImageObject"] = { url: false, datImgId: false };
                                    }


                                    if (optionset.datJsonModel["linkedMediaObject"]) {
                                        row["islinkedmediapopulated"] = ko.observable(true);
                                        row["linkedMediaObject"] = ko.observable(optionset.datJsonModel["linkedMediaObject"]);
                                    } else {
                                        row["islinkedmediapopulated"] = ko.observable(false);
                                        row["linkedMediaObject"] = ko.observable(false);
                                    };
                                    rslt.push(row);
                                }
                                catch (ex) { var wtf = true; }
                                return rslt;
                            };
                            var contentmodelcolxn = toEdithtml(xoptionset.datcomplete);
                            pageentry.contentelements = contentmodelcolxn;
                            return contentmodelcolxn;
                        },
                        makedefaultpgobj: function (xoptionset) {
                            var todefaulthtml = function (optionset) {
                                var rslt = [];
                                try { 
                                //var toemojis = function (elementIndex) {
                                //    var elemndx = "datEmoji" + ((elementIndex || 0) + 1);
                                //    ordered[x]['emoji'] = prweb.toImgUrl(prweb.pCElemHtmlDxnry[elemndx].resourceFile);
                                //};
                                var toCountablesColxn = function (cnt) {
                                    var todatelemtext = function (count, newcountable, ndx) {
                                        var rslt = "";
                                        try {
                                            if (optionset["captioncolxn"][ndx]) {
                                                newcountable.datElementText = optionset["captioncolxn"][ndx]["datElementText"];
                                            }
                                        }
                                        catch (ex) {
                                            var wtf = true;
                                        }
                                        return rslt;
                                    };
                                    var toNewCntble = function (ndx) {
                                        var newcntble = {
                                            objectId: 0,
                                            elemementImage: prweb.toImgUrl(prweb.pCElemHtmlDxnry["datNotifyIcon1"].resourceFile),
                                            elementimage: prweb.toImgUrl(prweb.pCElemHtmlDxnry["datNotifyIcon1"].resourceFile),
                                            elementIndex: ndx,
                                            elementindex: ndx,
                                            datElementText: "",
                                            responseCount: 0,
                                            dispose: false
                                        }
                                        if (cnt == 3) {
                                            //newcntble.elementIndex = ndx - 1;
                                            //newcntble.elementindex = ndx - 1;
                                            var whatisndx = newcntble.elementIndex;
                                        }
                                        return newcntble;
                                    };
                                    return Enumerable.Range(1, cnt).Select(function (c) {
                                        var newc = toNewCntble(c);
                                        todatelemtext(cnt, newc, c);
                                        return newc;
                                    }).ToArray();
                                };
                                    //#region ordercountables
                                var ordercountables = function (colxn, respcount) {
                                    //#region rateType functions
                                    var rateType = {
                                        3: function (ordX) {
                                            ordX["isFace"] = true;
                                            ordX["isStar"] = false;
                                            ordX["isCircle"] = false;
                                            ordX["divVisible"] = false;
                                            ordX["imgVisible"] = true;
                                            //ordX['emoji'] = '';
                                            var elemndx = "datFace" + ((ordX["elementIndex"] || 0) + 0);
                                            ordX['emoji'] = prweb.pCElemHtmlDxnry[elemndx].resourceFile.url() || prweb.pCElemHtmlDxnry[elemndx].resourceFile.url;
                                        },
                                        5: function (ordX) {
                                            ordX["isFace"] = false;
                                            ordX["isStar"] = true;
                                            ordX["isCircle"] = false;
                                            ordX["divVisible"] = true;
                                            ordX["imgVisible"] = false;
                                            ordX['emoji'] = '';
                                            //ordX['emoji'] = prweb.pCElemHtmlDxnry["datEmoji7"].resourceFile.url;
                                        },
                                        10: function (ordX) {
                                            ordX["isFace"] = false;
                                            ordX["isStar"] = false;
                                            ordX["isCircle"] = true;
                                            ordX["divVisible"] = true;
                                            ordX["imgVisible"] = false;
                                            ordX['emoji'] = '';
                                            //ordX['emoji'] = prweb.pCElemHtmlDxnry["datEmoji9"].resourceFile.url;
                                        }
                                    };
                                    //#endregion rateType functions
                                    var rslt = [];
                                    var ndxs = [];
                                    if (colxn.length == 3) {
                                        //#region faces
                                        ndxs = [0, 1, 2];
                                        var ordered = colxn;//Enumerable.From(colxn).OrderByDescending(function (x) { return x.responseCount }).ToArray();
                                        Enumerable.From(ndxs).ForEach(function (x) {
                                            if (x == 1) {
                                                ordered[x]["isFaceWinner"] = true;
                                            } else {
                                                ordered[x]["isFaceWinner"] = false;
                                            }

                                            ordered[x]["isStarWinner"] = false;
                                            ordered[x]["isStarEmpty"] = false;
                                            ordered[x]["isCircleWinner"] = false;
                                            ordered[x]["circleBackground"] = "rgba(255, 255, 255, 0)";
                                            ordered[x]['responsePercent'] = torespPctString(ordered[x].responseCount, respcount);
                                            ordered[x]["circleNumber"] = 0;
                                            rateType[colxn.length](ordered[x]);
                                            rslt.push(ordered[x]);
                                        });
                                        //#endregion faces
                                    } else if (colxn.length == 5) {
                                        //#region stars
                                        ndxs = [0, 1, 2, 3, 4];
                                        var ordered = Enumerable.From(colxn).OrderBy(function (x) { return x.elementIndex }).ToArray();
                                        var weightedCum = Enumerable.From(ndxs).Sum(function (x) { return ordered[x].responseCount * (x + 1); });
                                        var avg = weightedCum / respcount;
                                        if (pageentry.displaymode) {
                                            avg = pageentry.displaymode.countable.elementIndex + 1;
                                            var yes = true;
                                        }
                                        Enumerable.From(ndxs).ForEach(function (x) {
                                            if ((x + 1) <= avg) {
                                                ordered[x]["isStarWinner"] = true;
                                                ordered[x]["isStarEmpty"] = false;
                                            } else {
                                                ordered[x]["isStarEmpty"] = true;
                                                ordered[x]["isStarWinner"] = false;
                                            }
                                            ordered[x]['responsePercent'] = "";
                                            ordered[x]["isFaceWinner"] = false;
                                            ordered[x]["isCircleWinner"] = false;
                                            ordered[x]["circleBackground"] = "rgba(255, 255, 255, 0)";
                                            ordered[x]["circleNumber"] = 0;
                                            rateType[colxn.length](ordered[x]);
                                            rslt.push(ordered[x]);
                                        });
                                        //#endregion stars
                                    } else if (colxn.length == 10) {
                                        //#region circles
                                        var backcolors = {
                                            0: "rgba(40, 163, 236, 1)",
                                            1: "rgba(0, 150, 206, 1)",
                                            2: "rgba(0, 134, 156, 1)",
                                            3: "rgba(0, 124, 180, 1)",
                                            4: "rgba(0, 114, 206, 1)",
                                            5: "rgba(103, 113, 206, 1)",
                                            6: "rgba(81, 79, 206, 1)",
                                            7: "rgba(165, 60, 168, 1)",
                                            8: "rgba(206, 52, 81, 1)",
                                            9: "rgba(196, 41, 72, 1)",
                                            dispose: false
                                        }
                                        ndxs = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
                                        var ordered = Enumerable.From(colxn).OrderBy(function (x) { return x.elementIndex }).ToArray();
                                        var weightedCum = Enumerable.From(ndxs).Sum(function (x) { return ordered[x].responseCount * (x + 1); });
                                        var xrespcount = respcount || 1;
                                        var avg = Math.round(weightedCum / xrespcount);
                                        if (pageentry.displaymode) {
                                            avg = pageentry.displaymode.countable.elementIndex + 1;
                                            var yes = true;
                                        }
                                        Enumerable.From(ndxs).ForEach(function (x) {
                                            if ((x + 1) == avg) {
                                                ordered[x]["isCircleWinner"] = true;
                                                ordered[x]["circleBackground"] = "rgba(255, 180, 14, 1)";
                                            } else {
                                                ordered[x]["isCircleWinner"] = false;
                                                ordered[x]["circleBackground"] = backcolors[x] || "rgba(255, 17, 255, 1)";
                                            }
                                            ordered[x]["isFaceWinner"] = false;
                                            ordered[x]['responsePercent'] = "";
                                            ordered[x]["circleNumber"] = x + 1;
                                            ordered[x]["isStarWinner"] = false;
                                            ordered[x]["isStarEmpty"] = false;
                                            rateType[colxn.length](ordered[x]);
                                            rslt.push(ordered[x]);
                                        });
                                    }
                                    //#endregion stars

                                    return rslt;
                                };
                                    //#endregion ordercountables
                                var torespPctString = function (count, totresp) {
                                    var xcount = count || 0;
                                    var xtotresp = totresp || 1;
                                    var mypct = (xcount / xtotresp) * 100;
                                    return ((Math.round(mypct * Math.pow(10, 1)) / Math.pow(10, 1)).toString() + '%');
                                };
                                var buildcaptioncolxn = function (colxn) {
                                    var rslt = Enumerable.From(colxn).Where(function (c) { return c.datElementText != ""; }).Select(function (c) {
                                        return {
                                            colmx: ko.observable(4),
                                            alignment: ko.observable("textcenter"),
                                            datElementText: ko.observable(c.datElementText),
                                            responsePercent: ko.observable(c.responsePercent || "0%"),
                                            isFaceWinner: ko.observable(false)
                                        };
                                    }).ToArray();

                                    if (rslt.length > 0) {
                                        var xcol = 6;
                                        xcol = 12 / rslt.length;
                                        if (colxn.length == 10 || colxn.length == 5) {
                                            rslt[0].alignment("textleft");
                                            rslt[0].colmx(xcol);
                                            rslt[rslt.length - 1].alignment("textright");
                                            rslt[rslt.length - 1].colmx(xcol);
                                        }
                                    }

                                    return rslt;
                                };
                                var presT = "datRate1";
                                var row = pageentry.tomodelcore(presT);
                                //row["countableColxn"] = toCountablesColxn(optionset.countablesCount);
                                row["datcomplete"] = xoptionset;
                                row["datcomplete"]["countables"] = toCountablesColxn(optionset.countablesCount);
                                row["countableColxn"] = ordercountables(row["datcomplete"]["countables"]);
                                row["mainImage"] = ko.observable(optionset.otherdcelems[0].elementImage);
                                row["seeStoryUrl"] = optionset.otherdcelems[0].datElementText || false;
                                row["responseCount"] = Enumerable.From(row["datcomplete"]["countables"]).Sum(function (dce) { return dce.responseCount });
                                row["is3column"] = optionset.countablesCount == 3;
                                row["is5column"] = optionset.countablesCount == 5;
                                row["is10column"] = optionset.countablesCount == 10;
                                row["is5or10column"] = optionset.countablesCount == 10 || optionset.countablesCount == 5;
                                
                                row["ratecaptioncolxn"] = buildcaptioncolxn(row["countableColxn"]);
                                row["rateeditcaptioncolxn"] = row["ratecaptioncolxn"];
                                if (row["is3column"]) {
                                    if (row["ratecaptioncolxn"].length == 3) {
                                        row["ratecaptioncolxn"][1]["isFaceWinner"](true);
                                    }
                                }
                                var linkedmediaicon = prweb.pCElemHtmlDxnry["datLinkedMediaIcon1"].resourceFile.url();
                                row.modelcore["linkedMediaIcon"] = ko.observable(linkedmediaicon);
                                row["exposeLinkPasteArea"] = ko.observable(false);
                                row["isimagepopulated"] = ko.observable(false);
                                row["islinkedmediapopulated"] = ko.observable(false);
                                row["linkedMediaObject"] = ko.observable(false);
                                row["mainImageObject"] = { url: false, datImgId: false };
                                rslt.push(row);
                                }
                                catch (ex) { var wtf = true; }
                                return rslt;
                            };
                            var contentmodelcolxn = todefaulthtml(xoptionset);
                            pageentry.contentelements = contentmodelcolxn;
                            return contentmodelcolxn;
                        },
                        makepgobj: function (JSDat) {
                            var contentmodelcolxn = pageentry.tohtml(JSDat);
                            pageentry.contentelements = contentmodelcolxn;
                            return contentmodelcolxn;
                        },
                        tohtml: function (JSDat) {
                            var rslt = [];
                            var torespPctString = function (count, totresp) {
                                var xcount = count || 0;
                                var xtotresp = totresp || 1;
                                var mypct = (xcount / xtotresp) * 100;
                                return ((Math.round(mypct * Math.pow(10, 1)) / Math.pow(10, 1)).toString() + '%');
                            };
                            //#region ordercountables
                            var ordercountables = function (colxn, respcount) {
                                //#region rateType functions
                                var rateType = {
                                    3: function (ordX) {
                                        ordX["isFace"] = true;
                                        ordX["isStar"] = false;
                                        ordX["isCircle"] = false;
                                        ordX["divVisible"] = false;
                                        ordX["imgVisible"] = true;
                                        var elemndx = "datFace" + ((ordX["elementIndex"] || 0) + 1);
                                        ordX['emoji'] = prweb.pCElemHtmlDxnry[elemndx].resourceFile.url() || prweb.pCElemHtmlDxnry[elemndx].resourceFile.url;
                                    },
                                    5: function (ordX) {
                                        ordX["isFace"] = false;
                                        ordX["isStar"] = true;
                                        ordX["isCircle"] = false;
                                        ordX["divVisible"] = true;
                                        ordX["imgVisible"] = false;
                                        ordX['emoji'] = '';
                                        //ordX['emoji'] = prweb.pCElemHtmlDxnry["datEmoji7"].resourceFile.url;
                                    },
                                    10: function (ordX) {
                                        ordX["isFace"] = false;
                                        ordX["isStar"] = false;
                                        ordX["isCircle"] = true;
                                        ordX["divVisible"] = true;
                                        ordX["imgVisible"] = false;
                                        ordX['emoji'] = '';
                                        //ordX['emoji'] = prweb.pCElemHtmlDxnry["datEmoji9"].resourceFile.url;
                                    }
                                };
                                //#endregion rateType functions
                                var rslt = [];
                                var ndxs = [];
                                if (colxn.length == 3) {
                                    //#region faces
                                    ndxs = [2, 0, 1];
                                    var ordered = Enumerable.From(colxn).OrderByDescending(function (x) { return x.responseCount }).ToArray();
                                    Enumerable.From(ndxs).ForEach(function (x) {
                                        if (x == 0) {
                                            ordered[x]["isFaceWinner"] = true;
                                        } else {
                                            ordered[x]["isFaceWinner"] = false;
                                        }
                                        
                                        ordered[x]["isStarWinner"] = false;
                                        ordered[x]["isStarEmpty"] = false;
                                        ordered[x]["isCircleWinner"] = false;
                                        ordered[x]["circleBackground"] = "rgba(255, 255, 255, 0)";
                                        ordered[x]['responsePercent'] = torespPctString(ordered[x].responseCount, respcount);
                                        ordered[x]["circleNumber"] = 0;
                                        rateType[colxn.length](ordered[x]);
                                        rslt.push(ordered[x]);
                                    });
                                    //#endregion faces
                                } else if (colxn.length == 5) {
                                    //#region stars
                                    ndxs = [0, 1, 2, 3, 4];
                                    var ordered = Enumerable.From(colxn).OrderBy(function (x) { return x.elementIndex }).ToArray();
                                    var weightedCum = Enumerable.From(ndxs).Sum(function (x) { return ordered[x].responseCount * (x + 1); });
                                    var avg = weightedCum / respcount;
                                    if (pageentry.displaymode) {
                                        avg = pageentry.displaymode.countable.elementIndex + 1;
                                        var yes = true;
                                    }
                                    Enumerable.From(ndxs).ForEach(function (x) {
                                        if ((x+1) <= avg ) {
                                            ordered[x]["isStarWinner"] = true;
                                            ordered[x]["isStarEmpty"] = false;
                                        } else {
                                            ordered[x]["isStarEmpty"] = true;
                                            ordered[x]["isStarWinner"] = false;
                                        }
                                        ordered[x]['responsePercent'] = "";
                                        ordered[x]["isFaceWinner"] = false;
                                        ordered[x]["isCircleWinner"] = false;
                                        ordered[x]["circleBackground"] = "rgba(255, 255, 255, 0)";
                                        ordered[x]["circleNumber"] = 0;
                                        rateType[colxn.length](ordered[x]);
                                        rslt.push(ordered[x]);
                                    });
                                    //#endregion stars
                                } else if (colxn.length == 10) {
                                    //#region circles
                                    var backcolors = {
                                        0: "rgba(40, 163, 236, 1)",
                                        1: "rgba(0, 150, 206, 1)",
                                        2: "rgba(0, 134, 156, 1)",
                                        3: "rgba(0, 124, 180, 1)",
                                        4: "rgba(0, 114, 206, 1)",
                                        5: "rgba(103, 113, 206, 1)",
                                        6: "rgba(81, 79, 206, 1)",
                                        7: "rgba(165, 60, 168, 1)",
                                        8: "rgba(206, 52, 81, 1)",
                                        9: "rgba(196, 41, 72, 1)",
                                        dispose: false
                                    }
                                    ndxs = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
                                    var ordered = Enumerable.From(colxn).OrderBy(function (x) { return x.elementIndex }).ToArray();
                                    var weightedCum = Enumerable.From(ndxs).Sum(function (x) { return ordered[x].responseCount * (x + 1); });
                                    var xrespcount = respcount || 1;
                                    var avg = Math.round(weightedCum / xrespcount);
                                    if (pageentry.displaymode) {
                                        avg = pageentry.displaymode.countable.elementIndex + 1;
                                        var yes = true;
                                    }
                                    Enumerable.From(ndxs).ForEach(function (x) {
                                        if ((x+1 ) == avg){
                                            ordered[x]["isCircleWinner"] = true;
                                            ordered[x]["circleBackground"] = "rgba(255, 180, 14, 1)";
                                        } else {
                                            ordered[x]["isCircleWinner"] = false;
                                            ordered[x]["circleBackground"] = backcolors[x] || "rgba(255, 17, 255, 1)";
                                        }
                                        ordered[x]["isFaceWinner"] = false;
                                        ordered[x]['responsePercent'] = "";
                                        ordered[x]["circleNumber"] = x + 1;
                                        ordered[x]["isStarWinner"] = false;
                                        ordered[x]["isStarEmpty"] = false;
                                        rateType[colxn.length](ordered[x]);
                                        rslt.push(ordered[x]);
                                    });
                                }
                                //#endregion stars
                                
                                return rslt;
                            };
                            //#endregion ordercountables
                            var buildcaptioncolxn = function (colxn) {
                                var rslt = Enumerable.From(colxn).Where(function (c) { return c.datElementText != ""; }).Select(function (c) {
                                    return {
                                        colmx: ko.observable(4),
                                        alignment: ko.observable("textcenter"),
                                        datElementText: ko.observable(c.datElementText),
                                        responsePercent: ko.observable(c.responsePercent),
                                        isFaceWinner: ko.observable(false)
                                    };
                                }).ToArray();
                                
                                if (rslt.length > 0) {
                                    var xcol = 6;
                                    xcol = 12 / rslt.length;
                                    if (colxn.length == 10 || colxn.length == 5) {
                                        rslt[0].alignment("textleft");
                                        rslt[0].colmx(xcol);
                                        rslt[rslt.length - 1].alignment("textright");
                                        rslt[rslt.length - 1].colmx(xcol);
                                    } 
                                }
                                
                                return rslt;
                            };
                            //#region make row
                            try {
                                var presT = "datRate1";
                                var row = pageentry.tomodelcore(presT);
                                row["mainImage"] = prweb.toImgUrl(JSDat.otherdcelems[0].elementImage);
                                row["seeStoryUrl"] = JSDat.otherdcelems[0].datElementText || false;
                                row["responseCount"] = Enumerable.From(JSDat.countables).Sum(function (dce) { return dce.responseCount });
                                row["is3column"] = JSDat.countables.length == 3;
                                row["is5column"] = JSDat.countables.length == 5;
                                row["is10column"] = JSDat.countables.length == 10;
                                row["is5or10column"] = JSDat.countables.length == 10 || JSDat.countables.length == 5;
                                //this returns the same countables each time....does not work well in the responsesFeedElem/isDatCountableItemRated1...
                                if (pageentry.displaymode) {
                                    if (pageentry.displaymode.isDatCountableItemRated1) {
                                        //make a new set of countables
                                        var makenewcountables = function (colxn) {
                                            return newarray = Enumerable.From(colxn).Select(function (c) {
                                                var rslt = {};
                                                xrslt = JSON.stringify(c);
                                                rslt = JSON.parse(xrslt);
                                                return rslt;
                                            }).ToArray();
                                        };
                                        var newcountables = makenewcountables(JSDat.countables);
                                        row["countableColxn"] = ordercountables(newcountables, row["responseCount"]);
                                    } else {
                                        row["countableColxn"] = ordercountables(JSDat.countables, row["responseCount"]);
                                    }
                                } else {
                                    row["countableColxn"] = ordercountables(JSDat.countables, row["responseCount"]);
                                }
                               
                                row["ratecaptioncolxn"] = buildcaptioncolxn(row["countableColxn"]);
                                if (row["is3column"]) {
                                    if (row["ratecaptioncolxn"].length == 3) {
                                        row["ratecaptioncolxn"][1]["isFaceWinner"](true);
                                    }
                                }
                                //    [{ alignment: "textcenter", datElementText: "LEFT ", responsePercent: "82%" },
                                //    { alignment: "textcenter", datElementText: "MIDDLE", responsePercent: "72%" },
                                //    { alignment: "textcenter", datElementText: "RIGHT", responsePercent: "72%" }
                                //];
                                
                                rslt.push(row);
                            }
                            catch (ex) {
                                alert("prweb.datwebplayersvc.pagentry.tohtml type 2 reports " + ex.Message);
                            }
                            //#endregion make row
                            return rslt;//is an array of observable pagecontentelements...
                        },
                        voteHandler: function (selectedCountable) {
                            //find the selectedCountable in jsdat and recompute the html
                            var objid = selectedCountable.objectId;
                            var dcountable = Enumerable.From(pageentry.datObjectJs.countables).Where(function (x) {
                                return x.objectId == objid;
                            }).FirstOrDefault();
                            dcountable.responseCount += 1;
                            //var countables = pagenentry.datObjectJs.countables;
                            var dat = pageentry.makepgobj(pageentry.datObjectJs);//this is the same as JSDat
                            return dat;
                        },
                        updatePercents: function () { },
                        dispose: false
                    },
                    //#endregion
                    //#region datType 3
                    "3": {
                        makeEditpgobj: function (xoptionset) {
                            var toEdithtml = function (optionset) {
                                var rslt = [];
                                try {
                                    var presT = "datSentiment1";
                                    var row = pageentry.tomodelcore(presT);
                                    var toemoji = function (elementIndex) {
                                        var elemndx = "datEmoji" + elementIndex;
                                        var rslt = "xxxx";
                                        try {
                                            var obj = prweb.pCElemHtmlDxnry[elemndx].resourceModel || false;
                                            if (obj) {
                                                var jobj = JSON.parse(obj) || false;
                                                if (jobj) {
                                                    rslt = jobj["caption"];
                                                }
                                            }
                                        }
                                        catch (ex) {
                                            var wtf = true;
                                        }
                                        return {
                                            emoji: prweb.toImgUrl(prweb.pCElemHtmlDxnry[elemndx].resourceFile),
                                            caption: rslt,
                                            elementIndex: elementIndex,
                                            universeKey: elemndx,
                                            selected: ko.observable(false),
                                            isnotselected: ko.observable(true)
                                        };
                                    };
                                    row["emojiUniverse"] = Enumerable.Range(1, 15).Select(function (x) { return toemoji(x); }).ToArray()
                                    row["datcomplete"] = optionset;
                                    var toEmojiObject = function (xemojobj) {
                                        var rslt = {

                                        };
                                        Enumerable.From(["emoji", "caption", "universeKey"]).ForEach(function (p) {
                                            rslt[p] = xemojobj[p];
                                        });
                                        Enumerable.From(["selected", "isnotselected"]).ForEach(function (p) {
                                            rslt[p] = ko.observable(ko.unwrap(xemojobj[p]));
                                        });
                                        return rslt;
                                    };
                                    var toCountablesColxn = function (cnt) {
                                        var emojiLabelsDxnry = ['zero', 'one', 'two', 'three'];
                                        var toNewCntble = function (cntable, ndx) {
                                            var newcntble = {
                                                objectId: cntable.objectId,
                                                elemementImage: cntable.emoji,
                                                elementimage: cntable.emoji,
                                                elementIndex: cntable.elementIndex,
                                                elementindex: cntable.elementIndex,
                                                datElementText: cntable.datElementText,
                                                responseCount: cntable.responseCount,
                                                responsePercent: cntable.responsePercent,
                                                isWinner: cntable.isWinner,
                                                dispose: false
                                            }
                                            return newcntble;
                                        };
                                        var countables = optionset["countableColxn"];
                                        return Enumerable.Range(0, countables.length).Select(function (c) {
                                            var rslt = toNewCntble(countables[c], c);
                                            try {
                                                rslt.elementIndex = countables[c].elementIndex || 0;
                                            }
                                            catch (ex) {
                                                var wtf = true;
                                            }

                                            return rslt;
                                        }).ToArray();
                                    };
                                    var torespPctString = function (count, totresp) {
                                        var xcount = count || 0;
                                        var xtotresp = totresp || 1;
                                        var mypct = (xcount / xtotresp) * 100;
                                        return ((Math.round(mypct * Math.pow(10, 1)) / Math.pow(10, 1)).toString() + '%');
                                    };
                                    var ordercountables = function (colxn, respcount) {
                                        var ordered = Enumerable.From(colxn).OrderByDescending(function (x) {
                                            var tag = x.responseCount;
                                            if (x.isWinner) {
                                                tag += 1;
                                            }
                                            return tag;
                                        }).ToArray();
                                        var ndxs = [];
                                        if (colxn.length == 3) {
                                            ndxs = [2, 0, 1];//optionset["defaults"]["defaultEmojiNdxs3"];
                                        } else if (colxn.length == 5) {
                                            ndxs = [4, 2, 0, 1, 3];//optionset["defaults"]["defaultEmojiNdxs5"];
                                        }
                                        var rslt = [];
                                        try {
                                            Enumerable.From(ndxs).ForEach(function (x) {
                                                var universendx = ordered[x]["elementIndex"];
                                                row["emojiUniverse"][universendx]["selected"](true);
                                                ordered[x]["obsisWinner"] = ko.observable(ordered[x]["isWinner"]);
                                                ordered[x]['responsePercent'] = torespPctString(ordered[x].responseCount, respcount);
                                                ordered[x]['obsresponsePercent'] = ko.observable(torespPctString(ordered[x].responseCount, respcount));
                                                //ordered[x]['obsvbleresponseCount'] = ko.observable(ordered[x].responseCount);
                                                var elemndx = "datEmoji" + ((ordered[x]["elementIndex"] || 0) + 1);

                                                ordered[x]['emojiObj'] = ko.observable(toEmojiObject(row["emojiUniverse"][universendx]));
                                                ordered[x]['emoji'] = row["emojiUniverse"][universendx].emoji;
                                                rslt.push(ordered[x]);
                                            });
                                        }
                                        catch (ex) {
                                            var wtf = true;
                                        }
                                        return rslt;
                                    };
                                    row["datcomplete"]["countables"] = ko.unwrap(optionset["countables"]);//toCountablesColxn(optionset.countablesCount);
                                    row["countableColxn"] = ko.observableArray(ordercountables(row["datcomplete"]["countables"], row["responseCount"]));
                                    row["mainImage"] = ko.observable(optionset["datcountableitemVmx"]["mainImage"]);
                                    row["seeStoryUrl"] = optionset["datcountableitemVmx"]["seeStoryUrl"] || false;
                                    row["responseCount"] = Enumerable.From(row["datcomplete"]["countables"]).Sum(function (dce) { return dce.responseCount });
                                    row["is3column"] = row["datcomplete"]["countables"].length == 3;
                                    row["is5column"] = row["datcomplete"]["countables"].length == 5;
                                    var linkedmediaicon = prweb.pCElemHtmlDxnry["datLinkedMediaIcon1"].resourceFile.url();
                                    row.modelcore["linkedMediaIcon"] = ko.observable(linkedmediaicon);
                                    row["exposeLinkPasteArea"] = ko.observable(false);
                                    
                                    if (optionset.datJsonModel["mainImageObject"]) {
                                        row["mainImageObject"] = optionset.datJsonModel["mainImageObject"];
                                        if (optionset.datJsonModel["mainImageObject"]["datImgId"]) {
                                            row["isimagepopulated"] = ko.observable(true);
                                        } else {
                                            row["isimagepopulated"] = ko.observable(false);
                                        }
                                    } else {
                                        row["isimagepopulated"] = ko.observable(false);
                                        row["mainImageObject"] = { url: false, datImgId: false };
                                    }

                                    
                                    if (optionset.datJsonModel["linkedMediaObject"]) {
                                        row["islinkedmediapopulated"] = ko.observable(true);
                                        row["linkedMediaObject"] = ko.observable(optionset.datJsonModel["linkedMediaObject"]);
                                    } else {
                                        row["islinkedmediapopulated"] = ko.observable(false);
                                        row["linkedMediaObject"] = ko.observable(false);
                                    }
                                    rslt.push(row);
                                }
                                catch (ex) {
                                    var wtf = true;
                                }
                                return rslt;
                            };
                            var contentmodelcolxn = toEdithtml(xoptionset.datcomplete);
                            pageentry.contentelements = contentmodelcolxn;
                            return contentmodelcolxn;
                        },
                        makedefaultpgobj: function (xoptionset) {
                            var todefaulthtml = function (optionset) {
                                var rslt = [];
                                try { 
                                    var toemoji = function (elementIndex) {
                                        var elemndx = "datEmoji" + elementIndex;
                                        var rslt = "xxxx";
                                        try {
                                            var obj = prweb.pCElemHtmlDxnry[elemndx].resourceModel || false;
                                            if (obj) {
                                                var jobj = JSON.parse(obj) || false;
                                                if (jobj) {
                                                    rslt = jobj["caption"];
                                                }
                                            }
                                        }
                                        catch (ex) {
                                            var wtf = true;
                                        }
                                        return {
                                            emoji: prweb.toImgUrl(prweb.pCElemHtmlDxnry[elemndx].resourceFile),
                                            caption: rslt,
                                            elementIndex: elementIndex,
                                            universeKey: elemndx,
                                            selected: ko.observable(false),
                                            isnotselected: ko.observable(true)
                                    };
                                    };
                                    var toEmojiObject = function (xemojobj) {
                                        var rslt = {

                                        };
                                        Enumerable.From(["emoji", "caption", "universeKey"]).ForEach(function (p) {
                                            rslt[p] = xemojobj[p];
                                        });
                                        Enumerable.From(["selected", "isnotselected"]).ForEach(function (p) {
                                            rslt[p] = ko.observable(ko.unwrap(xemojobj[p]));
                                        });
                                        return rslt;
                                    };
                                    var toCountablesColxn = function (cnt) {
                                        var emojiLabelsDxnry = ['zero', 'one', 'two', 'three'];
                                        var toNewCntble = function (ndx) {
                                            var newcntble = {
                                                objectId: 0,
                                                elemementImage: prweb.toImgUrl(prweb.pCElemHtmlDxnry["datNotifyIcon1"].resourceFile),
                                                elementimage: prweb.toImgUrl(prweb.pCElemHtmlDxnry["datNotifyIcon1"].resourceFile),
                                                elementIndex: ndx,
                                                elementindex: ndx,
                                                datElementText: emojiLabelsDxnry[ndx],
                                                responseCount: 0,
                                                dispose: false
                                            }
                                            return newcntble;
                                        };
                                        var toUniversNdx = function (c) {
                                            var defaultscolxn = optionset.defaults.defaultEmojiNdxs3;
                                            if (cnt == 5) {
                                                defaultscolxn = optionset.defaults.defaultEmojiNdxs5;
                                            }
                                            return defaultscolxn[c];//is universeElementIndex..
                                        };
                                        return Enumerable.Range(0, cnt).Select(function (c) {
                                            var rslt = toNewCntble(c);
                                            try {
                                                rslt.elementIndex = toUniversNdx(c) || 0;
                                            }
                                            catch (ex) {
                                                var wtf = true;
                                            }
                                            
                                            return rslt;
                                        }).ToArray();
                                    };
                                    var torespPctString = function (count, totresp) {
                                        var xcount = count || 0;
                                        var xtotresp = totresp || 1;
                                        var mypct = (xcount / xtotresp) * 100;
                                        return ((Math.round(mypct * Math.pow(10, 1)) / Math.pow(10, 1)).toString() + '%');
                                    };
                                    var ordercountables = function (colxn, respcount) {
                                        var ordered = Enumerable.From(colxn).OrderByDescending(function (x) { return x.responseCount }).ToArray();
                                        var ndxs = [];
                                        if (colxn.length == 3) {
                                            ndxs = [2, 0, 1];//optionset["defaults"]["defaultEmojiNdxs3"];
                                        } else if (colxn.length == 5) {
                                            ndxs = [4, 2, 0, 1, 3];//optionset["defaults"]["defaultEmojiNdxs5"];
                                        }
                                        var rslt = [];
                                        try {
                                            Enumerable.From(ndxs).ForEach(function (x) {
                                                var universendx = ordered[x]["elementIndex"];
                                                row["emojiUniverse"][universendx]["selected"](true);
                                                if (x == 0) {
                                                    ordered[x]["isWinner"] = true;
                                                    ordered[x]["obsisWinner"] = ko.observable(true);
                                                } else {
                                                    ordered[x]["isWinner"] = false;
                                                    ordered[x]["obsisWinner"] = ko.observable(false);
                                                }
                                                ordered[x]['responsePercent'] = torespPctString(ordered[x].responseCount, respcount);
                                                ordered[x]['obsresponsePercent'] = ko.observable(torespPctString(ordered[x].responseCount, respcount));
                                                //ordered[x]['obsvbleresponseCount'] = ko.observable(ordered[x].responseCount);
                                                var elemndx = "datEmoji" + ((ordered[x]["elementIndex"] || 0) + 1);
                                                
                                                ordered[x]['emojiObj'] = ko.observable(toEmojiObject(row["emojiUniverse"][universendx]));
                                                ordered[x]['emoji'] = row["emojiUniverse"][universendx].emoji;//prweb.toImgUrl(prweb.pCElemHtmlDxnry[elemndx].resourceFile);
                                                var caption = function (cndx) {
                                                    var rslt = "xxxx";
                                                    try {
                                                        var obj = prweb.pCElemHtmlDxnry[cndx].resourceModel || false;
                                                        if (obj) {
                                                            var jobj = JSON.parse(obj) || false;
                                                            if (jobj) {
                                                                rslt = jobj["caption"];
                                                            }
                                                        }
                                                    }
                                                    catch (ex) {
                                                        var wtf = true;
                                                    }

                                                    return rslt;
                                                };
                                                ordered[x]['datElementText'] = caption(elemndx);
                                                rslt.push(ordered[x]);
                                            });
                                        }
                                        catch (ex) {
                                            var wtf = true;
                                        }
                                        
                                        return rslt;

                                    };
                                    var presT = "datSentiment1";
                                    var row = pageentry.tomodelcore(presT);
                                    row["emojiUniverse"] = Enumerable.Range(1, 15).Select(function (x) { return toemoji(x); }).ToArray()
                                    row["datcomplete"] = xoptionset;
                                    row["datcomplete"]["countables"] = toCountablesColxn(optionset.countablesCount);
                                    row["countableColxn"] = ko.observableArray(ordercountables(row["datcomplete"]["countables"], row["responseCount"]));
                                    row["mainImage"] = ko.observable(optionset.otherdcelems[0].elementImage);
                                    row["seeStoryUrl"] = optionset.otherdcelems[0].datElementText || false;
                                    row["responseCount"] = Enumerable.From(row["datcomplete"]["countables"]).Sum(function (dce) { return dce.responseCount });
                                    row["is3column"] = optionset.countablesCount == 3;
                                    row["is5column"] = optionset.countablesCount == 5;

                                    var linkedmediaicon = prweb.pCElemHtmlDxnry["datLinkedMediaIcon1"].resourceFile.url();
                                    row.modelcore["linkedMediaIcon"] = ko.observable(linkedmediaicon);
                                    row["exposeLinkPasteArea"] = ko.observable(false);
                                    row["isimagepopulated"] = ko.observable(false);
                                    row["islinkedmediapopulated"] = ko.observable(false);
                                    row["linkedMediaObject"] = ko.observable(false);
                                    row["mainImageObject"] = { url: false, datImgId: false };
                                    rslt.push(row);
                                
                                }
                                catch (ex) { var wtf = true; }
                                return rslt;
                            };
                            var contentmodelcolxn = todefaulthtml(xoptionset);
                            pageentry.contentelements = contentmodelcolxn;
                            return contentmodelcolxn;
                        },
                        makepgobj: function (JSDat) {
                            var contentmodelcolxn = pageentry.tohtml(JSDat);
                            pageentry.contentelements = contentmodelcolxn;
                            return contentmodelcolxn;
                        },
                        tohtml: function (JSDat) {
                            var rslt = [];
                            var torespPctString = function (count, totresp) {
                                var xcount = count || 0;
                                var xtotresp = totresp || 1;
                                var mypct = (xcount / xtotresp) * 100;
                                return ((Math.round(mypct * Math.pow(10, 1)) / Math.pow(10, 1)).toString() + '%');
                            };
                            var ordercountables = function (colxn, respcount) {
                                var ordered = Enumerable.From(colxn).OrderByDescending(function (x) { return x.responseCount }).ToArray();
                                var ndxs =[]; 
                                if (colxn.length == 3) {
                                    ndxs = [2, 0, 1];
                                } else if (colxn.length == 5) {
                                    ndxs = [4, 2, 0, 1, 3];
                                }
                                var rslt = [];
                                Enumerable.From(ndxs).ForEach(function (x) {
                                    if (x == 0) {
                                        ordered[x]["isWinner"] = true;
                                        ordered[x]["obsisWinner"] = ko.observable(true);
                                    } else {
                                        ordered[x]["isWinner"] = false;
                                        ordered[x]["obsisWinner"] = ko.observable(false);
                                    }
                                    ordered[x]['responsePercent'] = torespPctString(ordered[x].responseCount, respcount);
                                    ordered[x]['obsresponsePercent'] = ko.observable(torespPctString(ordered[x].responseCount, respcount));
                                    //ordered[x]['obsvbleresponseCount'] = ko.observable(ordered[x].responseCount);
                                    var elemndx = "datEmoji" + ((ordered[x]["elementIndex"] || 0) + 1);
                                    ordered[x]['emoji'] = prweb.toImgUrl(prweb.pCElemHtmlDxnry[elemndx].resourceFile);
                                    rslt.push(ordered[x]);
                                });
                                return rslt;

                            };
                            try {
                                var presT = "datSentiment1";
                                var row = pageentry.tomodelcore(presT);
                                row["mainImage"] = prweb.toImgUrl(JSDat.otherdcelems[0].elementImage);
                                row["seeStoryUrl"] = JSDat.otherdcelems[0].datElementText || false;
                                row["responseCount"] = ko.observable(Enumerable.From(JSDat.countables).Sum(function (dce) { return dce.responseCount }));
                                row["is3column"] = JSDat.countables.length == 3;
                                row["is5column"] = JSDat.countables.length == 5;
                                row["countableColxn"] = ko.observableArray(ordercountables(JSDat.countables, row["responseCount"]()));
                                //row["testIcon"] = prweb.pCElemHtmlDxnry["datangryicon"].resourceFile.url;
                                rslt.push(row);
                            }
                            catch (ex) {
                                alert("prweb.datwebplayersvc.pagentry.tohtml type 3 reports " + ex.Message);
                            }
                            return rslt;//is an array of observable pagecontentelements...
                        },
                        voteHandler: function (selectedCountable) {
                            //find the selectedCountable in jsdat and recompute the html
                            var objid = selectedCountable.objectId;
                            var dcountable = Enumerable.From(pageentry.datObjectJs.countables).Where(function (x) {
                                return x.objectId == objid;
                            }).FirstOrDefault();
                            dcountable.responseCount += 1;
                            //var countables = pagenentry.datObjectJs.countables;
                            var dat = pageentry.makepgobj(pageentry.datObjectJs);//this is the same as JSDat
                            return dat;
                        },
                        updatePercents: function (countableColxn) {
                            var rslt = [];
                            var torespPctString = function (count, totresp) {
                                var xcount = count || 0;
                                var xtotresp = totresp || 1;
                                var mypct = (xcount / xtotresp) * 100;
                                return ((Math.round(mypct * Math.pow(10, 1)) / Math.pow(10, 1)).toString() + '%');
                            };
                            var ordercountables = function (colxn, respcount) {
                                var ordered = Enumerable.From(colxn).OrderByDescending(function (x) { return x.responseCount }).ToArray();
                                var ndxs = [];
                                if (colxn.length == 3) {
                                    ndxs = [2, 0, 1];
                                } else if (colxn.length == 5) {
                                    ndxs = [4, 2, 0, 1, 3];
                                }
                                var rslt = [];
                                Enumerable.From(ndxs).ForEach(function (x) {
                                    if (x == 0) {
                                        ordered[x]["isWinner"] = true;
                                        ordered[x]["obsisWinner"](true);//= ko.observable(true);
                                    } else {
                                        ordered[x]["isWinner"] = false;
                                        ordered[x]["obsisWinner"](false);//= ko.observable(false);
                                    }
                                    ordered[x]['responsePercent'] = torespPctString(ordered[x].responseCount, respcount);
                                    ordered[x]['obsresponsePercent'](torespPctString(ordered[x].responseCount, respcount));
                                    var elemndx = "datEmoji" + ((ordered[x]["elementIndex"] || 0) + 1);
                                    ordered[x]['emoji'] = prweb.toImgUrl(prweb.pCElemHtmlDxnry[elemndx].resourceFile);
                                    rslt.push(ordered[x]);
                                });
                                return rslt;

                            };
                            try {
                                //var presT = "datSentiment1";
                                var row = {};
                                row["responseCount"] = Enumerable.From(countableColxn).Sum(function (dce) { return dce.responseCount });
                                row["countableColxn"] = ordercountables(countableColxn, row["responseCount"]);
                                rslt.push(row);
                            }
                            catch (ex) {
                                alert("prweb.datwebplayersvc.pagentry.updatePercents type 3 reports " + ex.Message);
                            }
                            return rslt;//is an array of observable pagecontentelements...
                        },
                        dispose: false
                    },
                    //#endregion
                    dispose: false
                };
                //#endregion
                //#region init
                pageentry.init = function (JSDat, mode) {
                    pageentry.datObjectJs = JSDat;
                    pageentry.displaymode = mode || false;
                    //dattype implies/establishes different methods for tohtml()...maybe voteHandler, updatePercents
                    pageentry.makepgobj = dattypeMethods[JSDat.datType].makepgobj;
                    pageentry.tohtml = dattypeMethods[JSDat.datType].tohtml;//just populates pageentry.tohtml with a function...not executed...
                    pageentry.voteHandler = dattypeMethods[JSDat.datType].voteHandler;//just populates pageentry.tohtml with a function...not executed...
                    pageentry.updatePercents = dattypeMethods[JSDat.datType].updatePercents;//just populates pageentry.tohtml with a function...not executed...
                    return pageentry.makepgobj(JSDat);
                };
                //#endregion
                //#region initDefault
                pageentry.initDefault = function (optionset) {
                    return dattypeMethods[optionset.datType].makedefaultpgobj(optionset);
                };
                //#endregion initDefault
                pageentry.datTypeUniverse = function (isedit) {
                    var rslt = [];
                    //#region optionSetDxnry
                    var optionSetDxnry = [
                        {
                            countablesCount: 3,
                            showHeaderQuestion: false,
                            id: 0,
                            datType: 3,
                            defaults: {
                                defaultEmojiNdxs3: [1, 8, 14],
                                defaultEmojiNdxs5: [4, 1, 8, 14, 8]
                            },
                            iconUrl: false,
                            selectortitle: "Sentiment",
                            textEditables: {
                                "titleText": {
                                    captiontext: "",
                                    placeholdertext: "How do you feel about this?...",
                                    isInput: false,
                                    isTextarea: true,
                                    "default": ""
                                }
                            }
                        },
                        {
                            countablesCount: 3,
                            captioncolxn: {
                                "1": { alignment: "textcenter", datElementText: "Yes", responsePercent: "82%" },
                                "2": { alignment: "textcenter", datElementText: "Maybe", responsePercent: "72%" },
                                "3": { alignment: "textcenter", datElementText: "No", responsePercent: "72%" }
                            },
                            showHeaderQuestion: false,
                            id: 1,
                            datType: 2,
                            iconUrl: false,
                            selectortitle: "Recommend Rating",
                            textEditables: {
                                "titleText": {
                                    captiontext: "",
                                    placeholdertext: "Would you recommend to a friend?",
                                    isInput: false,
                                    isTextarea: true,
                                    "default": ""
                                }
                            }
                        },
                        {
                            countablesCount: 5,
                            captioncolxn: {
                                "1": { alignment: "textcenter", datElementText: "Least", responsePercent: "82%" },
                                "3": { alignment: "textcenter", datElementText: "Somewhat", responsePercent: "72%" },
                                "5": { alignment: "textcenter", datElementText: "Best", responsePercent: "72%" }
                            },
                            showHeaderQuestion: false,
                            id: 2,
                            datType: 2,
                            iconUrl: false,
                            selectortitle: "Star Rating",
                            textEditables: {
                                "titleText": {
                                    captiontext: "",
                                    placeholdertext: "How do you rate this?",
                                    isInput: false,
                                    isTextarea: true,
                                    "default": ""
                                }
                            }
                        },
                        {
                            countablesCount: 10,
                            captioncolxn: {
                                "1": { alignment: "textcenter", datElementText: "Least", responsePercent: "82%" },
                                "5": { alignment: "textcenter", datElementText: "In between", responsePercent: "72%" },
                                "10": { alignment: "textcenter", datElementText: "Most", responsePercent: "72%" }
                            },
                            showHeaderQuestion: false,
                            id: 3,
                            datType: 2,
                            iconUrl: false,
                            selectortitle: "1-10 Rating",
                            textEditables: {
                                "titleText": {
                                    captiontext: "",
                                    placeholdertext: "On a scale of 1-10...how do you rate this?",
                                    isInput: false,
                                    isTextarea: true,
                                    "default": ""
                                }
                            }
                        },
                        {
                            countablesCount: 3,
                            showHeaderQuestion: true,
                            headerQuestionTextEditables: {
                                "titleText": {
                                    captiontext: "",
                                    placeholdertext: "Compare these options?",
                                    isInput: false,
                                    isTextarea: true,
                                    "default": ""
                                }
                            },
                            id: 4,
                            datType: 1,
                            iconUrl: prweb.pCElemHtmlDxnry["dat5CompareIcon1"].resourceFile.url(),
                            selectortitle: "Compare",
                            textEditables: {
                                "titleText": {
                                    captiontext: "",
                                    placeholdertext: "Option caption...",
                                    isInput: false,
                                    isTextarea: true,
                                    "default": ""
                                }
                            }
                        },
                        {
                            countablesCount: 2,
                            countableT: "dat115",
                            showHeaderQuestion: false,
                            id: 5,
                            datType: 11,
                            iconUrl: prweb.pCElemHtmlDxnry["datVerbatimIcon1"].resourceFile.url(),
                            linkedMediaIcon: prweb.pCElemHtmlDxnry["datLinkedMediaIcon1"].resourceFile.url(),
                            selectortitle: "Open Ended",
                            textEditables: {
                                "titleText": {
                                    captiontext: "",
                                    placeholdertext: "Ask a question?...",
                                    isInput: false,
                                    isTextarea: true,
                                    "default": ""
                                }
                            }
                        },
                        {
                            countablesCount: 3,
                            showHeaderQuestion: true,
                            headerQuestionTextEditables: {
                                "titleText": {
                                    captiontext: "",
                                    placeholdertext: "Choose from these?...",
                                    isInput: false,
                                    isTextarea: true,
                                    "default": ""
                                }
                            },
                            id: 6,
                            datType: 12,
                            iconUrl: prweb.pCElemHtmlDxnry["datChoiceIcon1"].resourceFile.url(),
                            linkedMediaIcon: prweb.pCElemHtmlDxnry["datLinkedMediaIcon1"].resourceFile.url(),
                            selectortitle: "Choice",
                            textEditables: {
                                "titleText": {
                                    captiontext: "",
                                    placeholdertext: "Answer description...",
                                    isInput: false,
                                    isTextarea: true,
                                    "default": ""
                                }
                            }
                        }
                    ];
                    //#endregion
                    if (isedit) {
                        var editOptionSetDxnry = optionSetDxnry;
                        var toEditDatComplete = function (os) {
                            var rslt = {
                                countablesCount: 0,
                                countables: [],
                                captioncolxn: os.captioncolxn || [],
                                datType: os.datType,
                                datJsonModel: isedit["singlepnldc"]["datJsonModel"],
                                otherdcelems: [
                                    {
                                        datElementText: false,
                                        elementImage: isedit["mainImage"] || false,
                                    }
                                ],
                                defaults: os.defaults,
                                dispose: false
                            };
                            try {
                                rslt["iseditobj"] = isedit;
                                rslt["datcountableitemVmx"] = isedit.datcountableitemVmx || false;
                                rslt["countableColxn"] = isedit["countableColxn"];
                                //if (rslt["datcountableitemVmx"]) {
                                //    rslt["countableColxn"] = ko.unwrap(isedit.datcountableitemVmx["countableColxn"]) || [];
                                //} else {
                                //    rslt["countableColxn"] = isedit["countableColxn"];
                                //}
                                rslt["countablesCount"] = rslt["countableColxn"].length;
                                rslt["countables"] = rslt["countableColxn"];
                                var yes = true;
                            }
                            catch (ex) {
                                var wtf = true;
                            }
                            return rslt;
                        };
                        rslt = Enumerable.From(editOptionSetDxnry)
                            .Where(function (os) {
                                var rslt = false;
                                try {
                                    var dattype = isedit.datType == os.datType;
                                    rslt = dattype;
                                    if (dattype == 2) {
                                        rslt = rslt && (os.countablesCount == isedit.datcountableitemVmx["countableColxn"].length);
                                    }
                                }
                                catch (ex) {
                                    var wtf = true;
                                }
                                return rslt;
                        }).Select(function (os) {
                                var datcomplete = toEditDatComplete(os.datType, os.countablesCount, os.captioncolxn, os.defaults);
                                os.datcomplete = datcomplete;
                                os.xcolxn = dattypeMethods[os.datType].makeEditpgobj(os);//datcomplete);
                                //var cntblecolxn = datcomplete["countableColxn"] || datcomplete["iseditobj"]["countableColxn"] || [];
                                //if (os.datType == isedit.datType && os.countablesCount == cntblecolxn.length) {
                                //    os.xcolxn = dattypeMethods[os.datType].makeEditpgobj(datcomplete);
                                //} else {
                                //   // os.xcolxn = dattypeMethods[os.datType].makedefaultpgobj(datcomplete);
                                //}
                                
                                return os;
                            }).ToArray();
                                
                    } else {
                        var toNewDatComplete = function (dattype, cntblecount, captions, defaults) {
                            var rslt = {
                                countablesCount: cntblecount,
                                countables: [],
                                captioncolxn: captions || [],
                                datType: dattype,
                                otherdcelems: [
                                    {
                                        datElementText: false,
                                        elementImage: prweb.toImgUrl(prweb.pCElemHtmlDxnry["datPhotoVideoIcon1"].resourceFile)//prweb.pCElemHtmlDxnry["datNotifyIcon1"].resourceFile,
                                    }
                                ],
                                defaults: defaults,
                                dispose: false
                            };
                            try { }
                            catch (ex) {
                                var wtf = true;
                            }
                            return rslt;
                        };
                        var rslt = Enumerable.From(optionSetDxnry)
                        .Where(function (os) {
                            return true;
                        }).Select(function (os) {
                            var datcomplete = toNewDatComplete(os.datType, os.countablesCount, os.captioncolxn, os.defaults);
                            os.xcolxn = dattypeMethods[os.datType].makedefaultpgobj(datcomplete);
                            os.datcomplete = datcomplete;
                            return os;
                        }).ToArray();
                    }
                    
                    return rslt;
                    
                };
                
                return pageentry;
            };

            return that; //NewDatPlayerSvc
        };
        
        sps.observablemodelsvc = (function () {
            var oms = {};
            oms.uid = 0;

            oms.UniqueID = function () {
                oms.uid++;
                return Math.max(1, oms.uid);
            };
            //#region JSData JSValuorDefault Utility methods

            oms.JSData = null;

            oms.JSValorDefault = function (dflt, prop) {
                var rslt = dflt;
                if (oms.JSData) {
                    if (undefined != oms.JSData[prop]) {
                        rslt = oms.JSData[prop];
                    }
                }
                dflt = null;
                prop = null;
                return rslt;
            };

            //#endregion
            //this is called from datType 1 methods...legacy stuff for now...
            oms.PCElemFromJSData = function (T, dcelement) {
                var rslt = {};
                try {
                    rslt = {
                        modelcore: {
                            presenterT: T,
                            html: ko.observable(prweb.pCElemHtmlDxnry[T].resourceModel),
                            dcelementId: dcelement.objectId || false,
                            datblueImage: ko.observable(prweb.pCElemHtmlDxnry['datBlue1'].resourceModel)
                        }
                    };
                    if (dcelement.hasOwnProperty('elementImage')) {
                        rslt.modelcore['elementImage'] = ko.observable(prweb.toImgUrl(dcelement.elementImage));
                    }
                    rslt.objectId = dcelement.objectId;
                    rslt.modelcore['responsePercent'] = ko.observable(0);
                    rslt.modelcore['BorderBrushStr'] = ko.observable(oms.JSValorDefault("rgba(240,240,255, 1)", "BorderBrushStr"));
                    rslt.modelcore['responseCount'] = ko.observable(dcelement['responseCount']);
                    rslt.modelcore['headerText'] = ko.observable(dcelement['headerText']);
                    rslt.modelcore['titleText'] = ko.observable(dcelement['titleText']);
                    rslt.modelcore['datElementText'] = ko.observable(dcelement['datElementText']);
                    var linkedmediaicon = prweb.pCElemHtmlDxnry["datLinkedMediaIcon1"].resourceFile.url();
                    rslt.modelcore["linkedMediaIcon"] = ko.observable(linkedmediaicon);
                }
                catch (ex) {
                    var wtf = true;
                }
                return rslt;
            };

            return oms;//sps.observablemodelsvc
        }());

        
        return sps;
    }());
}(this.prweb = this.prweb || {}, jQuery));