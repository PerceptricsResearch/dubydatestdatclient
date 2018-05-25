(function (prweb, $) {
    prweb.parseManager = {

        createDatImageFromUrl: function (parms) {
            var params = {
                updateTarget: "createDatImageFromUrl",
                urlString: parms.url || false
            };
            return Parse.Cloud.run('createDatImageFromUrl', params).then(function (results) {
                return results;
            }).fail(function (ex) {
                var exm = ex.message.toString();
                prweb.log("prweb.datwebdata.processUrl promise catch..." + ex.message);
            });
        },

        editDat: function (parms) {
            var params = parms;
            params["updateTarget"] = "datEdit";
            return Parse.Cloud.run('updateDatStatus', params).then(function (results) {
                return results;
            }).fail(function (ex) {
                var exm = ex.message.toString();
                prweb.log("prweb.datwebdata.editDat promise catch..." + ex.message);
            });
        },

        originateDat: function (parms) {
            var params = {
                updateTarget: "datOriginate",
                shareOptions: parms["shareOptions"],
                originateParams: {
                    jsonModel: JSON.stringify(parms["jsonModel"]),
                    linkedMediaObject: parms["linkedMediaObject"],
                    mainImageObject: parms["mainImageObject"],
                    clientAppID: parms["clientAppID"],
                    datType: parms["datType"],
                    datHeaderText: parms["datHeaderText"],
                    seeStoryUrl: parms["seeStoryUrl"],
                    countablesColxn: parms["countablesColxn"],
                    rateCaptionColxn: parms["rateCaptionColxn"],
                    datImagesColxnIDs: parms["datImagesColxnIDs"]
                }
            };
            return Parse.Cloud.run('updateDatStatus', params).then(function (results) {
                return results;
            }).fail(function (ex) {
                var exm = ex.message.toString();
                prweb.log("prweb.datwebdata.originateDat promise catch..." + ex.message);
            });
        },

        processUrl: function (parms) {
            var params = {
                updateTarget: "",
                urlString: parms.url || false
            };
            return Parse.Cloud.run('processURL', params).then(function (results) {
                return results;
            }).fail(function (ex) {
                var exm = ex.message.toString();
                prweb.log("prweb.datwebdata.processUrl promise catch..." + ex.message);
            });
        },

        getDatInviteUrl: function (parms) {
            var params = {
                updateTarget: "",
                datObjectId: parms.datObjectId || false,
                inviteImageObjectId: parms.inviteImageObjectId || false,
                magicDceObjectId: parms.magicDceObjectId,
                groupId: parms.groupId || false
            };
            return Parse.Cloud.run('getDatInviteUrl', params).then(function (results) {
                return results;
            }).fail(function (ex) {
                var exm = ex.message.toString();
                prweb.log("prweb.datwebdata.addUser promise catch..." + ex.message);
            });
        },

        addAutoAnonUser: function (parms) {
            var params = {
                updateTarget: "newAutoAnonUser",
                DatGroupID: parms.DatGroupID || false,
                groupId: parms.groupId || false,
                updateType: parms.updateType || false,
                memberFirstName: parms.memberFirstName
            };
            return Parse.Cloud.run('updateUserStatus', params).then(function (results) {
                return results;
            }).fail(function (ex) {
                var exm = ex.message.toString();
                prweb.log("prweb.datwebdata.addUser promise catch..." + ex.message);
            });
        },

        userProfileUpdate: function (parms) {
            var params = {
                updateTarget: "userProfileUpdate",
                userInfoDict: parms["userInfoDict"]
            };
            return Parse.Cloud.run('updateUserStatus', params).then(function (results) {
                return results;
            }).fail(function (ex) {
                var exm = ex.message.toString();
                prweb.log("prweb.datwebdata.editUserProfile promise catch..." + ex.message);
            });
        },

        datCloseOpen: function (parms) {
            var params = {
                updateTarget: "datClose",
                datObjectId: parms["datid"],
                limit: parms.limit || 20,
                skip: parms.skip || 0
            };
            return Parse.Cloud.run('updateDatStatus', params).then(function (results) {
                return results;
            }).fail(function (ex) {
                var exm = ex.message.toString();
                prweb.log("prweb.datwebdata.datCloseOpen promise catch..." + ex.message);
            });
        },

        hideDat: function (parms) {
            var params = {
                updateTarget: "hideDat",
                datObjectId: parms["datid"],
                limit: parms.limit || 20,
                skip: parms.skip || 0
            };
            return Parse.Cloud.run('updateDatStatus', params).then(function (results) {
                return results;
            }).fail(function (ex) {
                var exm = ex.message.toString();
                prweb.log("prweb.datwebdata.hideDat promise catch..." + ex.message);
            });
        },

        hideComment: function (parms) {
            var params = {
                updateTarget: "hideComment",
                objectId: parms.objectId,
                commentOwnerId: parms.commentOwnerId,
                datid: parms.datid,
                commentmsg: parms.commentmsg,
                limit: parms.limit || 20,
                skip: parms.skip || 0
            };
            return Parse.Cloud.run('updateDatComment', params).then(function (results) {
                return results;
            }).fail(function (ex) {
                prweb.log("prweb.datwebdata.hideComment promise catch..." + ex.message);
                var exm = ex.message.toString() || false;
                return exm;
            });
        },

        commentDelete: function (parms) {
            var params = {
                updateTarget: "commentDelete",
                objectId: parms.objectId,
                commentOwnerId: parms.commentOwnerId,
                datid: parms.datid,
                commentmsg: parms.commentmsg,
                limit: parms.limit || 20,
                skip: parms.skip || 0
            };
            return Parse.Cloud.run('updateDatComment', params).then(function (results) {
                return results;
            }).fail(function (ex) {
                prweb.log("prweb.datwebdata.commentDelete promise catch..." + ex.message);
                var exm = ex.message.toString();
                return exm || false;
            });
        },

        datDelete: function (parms) {
            var params = {
                updateTarget: "datDelete",
                datObjectId: parms["datid"],
                limit: parms.limit || 20,
                skip: parms.skip || 0
            };
            return Parse.Cloud.run('updateDatStatus', params).then(function (results) {
                return results;
            }).fail(function (ex) {
                var exm = ex.message.toString();
                prweb.log("prweb.datwebdata.datDelete promise catch..." + ex.message);
            });
        },

        publicPrivateDat: function (parms) {
            var params = {
                updateTarget: "datPublicPrivate",
                datObjectId: parms["datid"],
                public: parms["public"],
                limit: parms.limit || 20,
                skip: parms.skip || 0
            };
            return Parse.Cloud.run('updateDatStatus', params).then(function (results) {
                return results;
            }).fail(function (ex) {
                var exm = ex.message.toString();
                prweb.log("prweb.datwebdata.publicPrivateDat promise catch..." + ex.message);
            });
        },

        shareDat: function (parms) {
            var params = {
                updateTarget: "shareDat",
                datFriends: parms.datFriends,
                groups: parms.groups,
                datObjectId: parms.datObjectId,
                limit: parms.limit || 20,
                skip: parms.skip || 0
            };
            return Parse.Cloud.run('updateDatStatus', params).then(function (results) {
                return results;
            }).fail(function (ex) {
                var exm = ex.message.toString();
                prweb.log("prweb.datwebdata.shareDat promise catch..." + ex.message);
            });
        },

        getUserDatFriends: function (parms) {
            var params = {
                updateTarget: "userDatFriends",
                limit: parms.limit || 20,
                skip: parms.skip || 0
            };
            return Parse.Cloud.run('updateUserStatus', params).then(function (results) {
                return results;
            }).fail(function (ex) {
                var exm = ex.message.toString();
                prweb.log("prweb.datwebdata.getUserDatFriends promise catch..." + ex.message);
            });
        },

        getUserIsFollowingList: function (parms) {
            var params = {
                updateTarget: "getUserIsFollowingList",
                limit: parms.limit || 20,
                skip: parms.skip || 0
            };
            return Parse.Cloud.run('updateUserStatus', params).then(function (results) {
                return results;
            }).fail(function (ex) {
                var exm = ex.message.toString();
                prweb.log("prweb.datwebdata.getUserIsFollowingList promise catch..." + ex.message);
            });
        },

        getUserIsFollowedByList: function (parms) {
            var params = {
                updateTarget: "getUserIsFollowedByList",
                limit: parms.limit || 20,
                skip: parms.skip || 0
            };
            return Parse.Cloud.run('updateUserStatus', params).then(function (results) {
                return results;
            }).fail(function (ex) {
                var exm = ex.message.toString();
                prweb.log("prweb.datwebdata.getUserIsFollowedByList promise catch..." + ex.message);
            });
        },

        updateCommentResults: function (parms) {
            try {
                var params = {
                    datObjectId: parms["datobjectId"],
                    commentObjectId: parms["commentobjectId"],
                    responseCount: parms["responseCount"],
                    IsReplyComment: parms["IsReplyComment"],
                    replyId: parms["replyId"],
                    DatContentElementObjectID: parms["dceid"]
                };

                return Parse.Cloud.run("updateCommentResult", params).then(function (results) {
                    return results;
                }).fail(function (badresults) {
                    prweb.log("prweb.datwebdata.updateCommentResults promise fail..." + badresults);
                });
            }
            catch (ex) {
                prweb.log("prweb.datwebdata.updateCommentResults try catch..." + badresults);
            }
        },

        originateGroup: function (parms) {
            var params = {
                updateTarget: "userNewGroup",
                groupName: parms.groupName || false,
                groupImage: parms.groupImage || false,
                datFriends: parms.datFriends || false,
                followers: parms.followers || false,
                following: parms.following || false,
                groupStatusTags: parms.groupStatusTags || [],
                clientAppID: parms.clientAppID,
                jsonModel: parms.jsonModel || false
            };
            return Parse.Cloud.run('updateUserStatus', params).then(function (results) {
                return results;
            }).fail(function (ex) {
                var exm = ex.message.toString();
                prweb.log("prweb.datwebdata.getGroups promise catch..." + ex.message);
            })
        },

        groupUpdate: function (parms) {
            var params = {
                updateTarget: "groupUpdate",
                DatGroupID: parms.groupid || false,
                updateType: parms["updateType"]
            };
            return Parse.Cloud.run('updateUserStatus', params).then(function (results) {
                return results;
            }).fail(function (ex) {
                var exm = ex.message.toString();
                prweb.log("prweb.datwebdata.getGroups promise catch..." + ex.message);
            })
        },
        //DatGroupID, filter
        getGroups: function (parms) {
            var params = {
                updateTarget: "userDatGroups",
                DatGroupID: parms.groupid || false,
                filter: parms.xfilter || false,
                limit: parms.limit || 20,
                skip: parms.skip || 0
            };
            return Parse.Cloud.run('updateUserStatus', params).then(function (results) {
                return results;
            }).fail(function (ex) {
                var exm = ex.message.toString();
                prweb.log("prweb.datwebdata.getGroups promise catch..." + ex.message);
            });
        },

        testCloud: function () {
            //var query = new Parse.Query(Parse.Installation);
            //query.equalTo('appIdentifier', 'com.perceptricsresearch.dat');
            Parse.Cloud.run('hello').then(function (results) {
                prweb.log("prweb.datwebdata.testCloud  " + results);
            }, function (badresults) {
                prweb.log("prweb.datwebdata.testCloud error callback..." + badresults);
            });
            
            //Parse.Cloud.run('testFeedElem').then(function (results) {
            //    prweb.log("prweb.datwebdata.testFeedElem  " + results);
            //}, function (badresults) {
            //    prweb.log("prweb.datwebdata.testFeedElem error callback..." + badresults);
            //});
            //var inviteparms = {
            //    datId: 'HElIDx2FJu'
            //};
            //Parse.Cloud.run('inviteWithTwilio', inviteparms).then(function (results) {
            //    prweb.log("prweb.datwebdata.testCloud.inviteWithTwilio  " + results);
            //}, function (badresults) {
            //    prweb.log("prweb.datwebdata.testCloud.inviteWithTwilio error callback..." + badresults);
            //});
            //Parse.Cloud.run('pushTest').then(function (results) {
            //    prweb.log("prweb.datwebdata.testPush  " + results);
            //}, function (badresults) {
            //    prweb.log("prweb.datwebdata.testPush error callback..." + badresults);
            //});
            //Parse.Cloud.run('getWebResources').then(function (results) {
            //    prweb.log("prweb.datwebdata.testCloud.getWebResources  " + results);
            //}, function (badresults) {
            //    prweb.log("prweb.datwebdata.testCloud.getWebResources error callback..." + badresults);
            //});
        },

        addAnonPublicUser: function (parms) {
            var params = {
                updateTarget: "newUser",
                isnewpublicuser: true,
            };
            return Parse.Cloud.run('updateUserStatus', params).then(function (results) {
                return results;
            }).fail(function (ex) {
                var exm = ex.message.toString();
                prweb.log("prweb.datwebdata.addAnonPublicUser promise catch..." + ex.message);
            });
        },

        addUser: function (parms) {
            var params = {
                updateTarget: "newUser",
                fbdata: parms.fbdata || false
            };
            return Parse.Cloud.run('updateUserStatus', params).then(function (results) {
                return results;
            }).fail(function (ex) {
                var exm = ex.message.toString();
                prweb.log("prweb.datwebdata.addUser promise catch..." + ex.message);
            });
        },

        getResources: function (xparms) {
            var parms = xparms || {};
            var params = {
                platformId: parms["platformid"] || 'Web'
            };
            return Parse.Cloud.run('getWebResources', params).then(function (results) {
                return results;
            }).fail(function (ex) {
                
                var exm = ex.message.toString();
                prweb.log("prweb.datwebdata.getResources promise catch..." + ex.message);
                return Parse.Promise.as(exm);
            });
        },

        testPush: function () {


            Parse.Cloud.run('pushTest').then(function (results) {
                prweb.log("prweb.datwebdata.testPush  " + results);
            }, function (badresults) {
                prweb.log("prweb.datwebdata.testPush error callback..." + badresults);
            });
        },
        getUserProfile: function (userid) {
            var params = {
                updateTarget: "userProfileGet",
                user_id: userid
            };
            return Parse.Cloud.run('updateUserStatus', params).then(function (results) {
                return results;
            }).fail(function (ex) {
                var exm = ex.message.toString();
                prweb.log("prweb.datwebdata.getUserProfile promise catch..." + ex.message);
            });
        },
        
        getDatsProfileFiltered: function (userid, xfilter) {
            var params = {
                updateTarget: "getDatsProfileFiltered",
                user_id: userid,
                filter: xfilter,
                limit: 8,
                skip: 0
            };
            return Parse.Cloud.run('updateUserStatus', params).then(function (results) {
                return results;
            }).fail(function (ex) {
                var exm = ex.message.toString();
                prweb.log("prweb.datwebdata.getDatsProfileFiltered promise catch..." + ex.message);
            });
        },

        getUser: function (options) {
            if (!(undefined == Parse)) {
                //Parse.User.logIn('wbartel@interserv.com', '11111111', options);
                options.success(Parse.User.current());
            } else {
                options.error(false);
            }
        },

        loadMyNotifications: function (parms) {
            var params = {
                limit: parms.limit || 12,
                skip: parms.skip || 0
            };
            return Parse.Cloud.run('loadMyNotifications', params).then(function (results) {
                return results;
            }).fail(function (ex) {
               var exm = ex.message.toString();
               prweb.log("prweb.datwebdata.getDatComplete.loadMyDats promise catch..." + ex.message);
            });
        },

        loadMyDats: function (parms) {
            var params = {
                limit: parms.limit || 12,
                skip: parms.skip || 0
            };
            if (parms["userFilter"]) {
                params["userFilter"] = parms["userFilter"];
            }
            return Parse.Cloud.run('loadMyDats', params).then(function (results) {
                return results;
            });
            //.fail(function (ex) {
            //    prweb.log("prweb.datwebdata.getDatComplete.loadMyDats promise catch..." + ex.message);
            //});
        },

        updateUserFilter: function (parms) {
            var params = {
                updateTarget: "userFilter",
                limit: parms.limit || 12,
                skip: parms.skip || 0
            };
            if (parms["userFilter"]) {
                params["userFilter"] = parms["userFilter"];
            }
            return Parse.Cloud.run('updateUserStatus', params).then(function (results) {
                return results;
            });
            //.fail(function (ex) {
            //    prweb.log("prweb.datwebdata.getDatComplete.loadMyDats promise catch..." + ex.message);
            //});
        },

        datViewed: function (parms) {
            var params = {
                datObjectId: parms.datid,
                updateTarget: 'datViewed',
                datOwnerId: parms.datownerid,
                limit: parms.limit || 6,
                skip: parms.skip || 0
            };
            return Parse.Cloud.run('updateDatStatus', params).then(function (results) {
                return results;
            });
        },

        getdatRepondentsList: function (parms) {
            var params = {
                datObjectId: parms.datid,
                datContentElementObjectID: parms.dceid,
                updateTarget: 'getdatRespondentsList',
                limit: parms.limit || 6,
                skip: parms.skip || 0
            };
            return Parse.Cloud.run('updateDatStatus', params).then(function (results) {
                return results;
            });
        },

        getDats: function (options) {
            try {
                var q = new Parse.Query('Dat');
                q.find(options);
            }
            catch (ex){
                alert("datwebdata.getDats reports " + ex.message);
            }
        },

        getDatContentElements: function (datId, options) {
            try {

            }
            catch (ex) {

            }
        },


        postEditDatComment: function (params, options) {
            try {
                var params = {
                    updateTarget: "commentUpdate",
                    objectId: params.objectId,
                    commentOwnerId: params.commentOwnerId,
                    datid: params.datid,
                    replyId: params.replyId || false,
                    IsReplyComment: params.IsReplyComment || false,
                    commentmsg: params.commentmsg
                };
                return Parse.Cloud.run("updateDatComment", params).then(function (results) {
                    return results;
                }).fail(function (ex) {
                    var exm = ex.message.toString();
                    prweb.log("prweb.datwebdata.postEditDatComment promise catch..." + ex.message);
                });
            }
            catch (ex) {
                var tt = 2;
            }
        },

        addReplyComment: function (xdatid, cmntmsg) {
            try {
                var params = {
                    updateTarget: 'addReplyComment',
                    replyid: xdatid,
                    commentmsg: cmntmsg
                };
                return Parse.Cloud.run("updateUserStatus", params).then(function (results) {
                    return results;
                }).fail(function (badresults) {
                    prweb.log("prweb.datwebdata.addReplayComment error callback..." + badresults);
                    return badresults;
                });
            }
            catch (ex) {
                var tt = 2;
            }
        },

        getReplyComments: function (replyid) {
            try {
                var params = {
                    updateTarget: 'getReplyComments',
                    replyid: replyid
                };
                return Parse.Cloud.run("getReplyComments", params).then(function (results) {
                    return {
                        dcmntscolxn: results.dcmntscolxn
                    };
                }).fail(function (badresults) {
                    prweb.log("prweb.datwebdata.getReplyComments error callback..." + badresults);
                    return badresults;
                });
            }
            catch (ex) {
                var tt = 2;
            }
        },

        addDatComment: function (xdatid, cmntmsg) {
            try {
                var params = {
                    datid: xdatid,
                    commentmsg: cmntmsg
                };
                return Parse.Cloud.run("addComment", params).then(function (results) {
                    return results;
                }).fail(function (badresults) {
                    prweb.log("prweb.datwebdata.addComment error callback..." + badresults);
                    return badresults;
                });
            }
            catch (ex) {
                var tt = 2;
            }
        },

        getDatComments: function (parsedatobj, options) {
            try {
                var params = { datid: parsedatobj.objectId };
                return Parse.Cloud.run("getDatComments", params).then(function (results) {
                    var rslt = {
                        dcmntscolxn: results.dcmntscolxn,
                        parsedcmntscolxn: null
                    };
                    return rslt;
                            //var makedce = function (item) {
                            //    rslt.dcmntscolxn.push(item.toJSON());
                            //    rslt.parsedcmntscolxn = results;
                            //    return true;
                            //};
                            //Enumerable.From(results.dcmntscolxn).ForEach(function (dcmt) { return makedce(dcmt) });
                    //options.success(rslt);
                    //prweb.log("prweb.datwebdata.getDatCommentsTEST  " + results);
                }).fail(function (badresults) {
                    prweb.log("prweb.datwebdata.getDatCommentsTEST error callback..." + badresults);
                });
                //parsedatobj.get('datComments').query().include('commentUser').find({
                //parsedatobj.relation('datComments').query().include('commentUser').find({
                //    success: function (dcmnts) {
                //        var rslt = {
                //            dcmntscolxn: [],
                //            parsedcmntscolxn: null
                //        };
                //        var makedce = function (item) {
                //            //rslt.dcmntscolxn.push(item.toJSON());
                //            rslt.parsedcmntscolxn = dcmnts;
                //            return true;
                //        };
                //        Enumerable.From(dcmnts).ForEach(function (dcmt) { return makedce(dcmt) });
                //        options.success(rslt);
                //    },
                //    error: function (ex) {
                //        prweb.log("prweb.datwebdata.getDatComments error callback..." + ex);
                //    }
                //});
            }
            catch (ex) {
                prweb.log("prweb.datwebdata.getDatComments catch exception..." + ex.message);
            }
        },

        getInviteComplete: function (invid) {
            var params = {
                inviteId: invid
            };
            return Parse.Cloud.run('loadMyInvitation', params).then(function (results) {
                return results;
            }).fail(function (ex) {
                var exm = ex.message.toString();
                prweb.log("prweb.datwebdata.getInviteComplete.loadMyNotification promise catch..." + ex.message);
            });
        },

        getInviteCompleteOLD: function(inviteId, options){
            var q = new Parse.Query('Invitation');
            q.include('dat').include('user').include('contact').get(inviteId, {
                success: function (invobj) {
                    var jsinvite = invobj.toJSON();
                    options.success({
                        invite: jsinvite,
                        dat: jsinvite.dat,
                        datcomplete: jsinvite.dat.datFeedElement
                    });
                    //prweb.parseManager.getDatComplete(jsinvite.dat.objectId, {
                    //    success: function (jsdat) {
                    //        jsdat.invite = jsinvite;
                    //        options.success(jsdat);
                    //    },
                    //    error: function () { }
                    //});
                    //var z = 2;
                },
                error: function (ex) {
                    options.error(ex);
                }
            });
        
        },

        getDatComplete: function (datId, options) {
            try {
                var JSDat = {
                    dat: false,
                    dcecolxn: [],
                    parsedatobj: null,
                    parsedcecolxn: null
                };
                var q = new Parse.Query('Dat');
                q.get(datId,{
                    success: function (datobj) {
                        JSDat.dat = datobj.toJSON();
                        JSDat.parsedatobj = datobj;
                        try {
                            //datobj.get('datContentElements').query().include("elementImage").find({
                            datobj.relation('datContentElements').query().include("elementImage").find({
                                success: function (dces) {
                                    var makedce = function (item) {
                                        JSDat.dcecolxn.push(item.toJSON());
                                        JSDat.parsedcecolxn = dces;
                                        return true;
                                    };
                                    Enumerable.From(dces).ForEach(function (dce) { return makedce(dce) });
                                    options.success(JSDat);
                                },
                                error: function (ex) {
                                    prweb.log("prweb.datwebdata.getDatComplete.getdatContentElements error callback..." + ex);
                                }
                            });
                        }
                        catch (ex) {
                            prweb.log("prweb.datwebdata.getDatComplete.getdatContentElements error callback..." + ex);
                        }
                    },
                    error: function (ex) {
                        prweb.log("prweb.datwebdata.getDatComplete.getdatId reports catch exception..." + ex);
                    },
                });
            }
            catch (ex) {
                prweb.log("datwebdata.getDatComplete reports " + ex.message);
            }
        },

        updateDatResults: function (parms) {
            try {
                var params = {
                    datObjectId: parms.datobjectId,
                    responseCount: parms.responseCount,
                    DatContentElementObjectID: parms.dceid,
                    verbatimText: parms.verbatimText || false,
                    replyId: parms.replyId || false,
                    isRevision: parms.isRevision || false
                };

                return Parse.Cloud.run("updateDatResult", params).then(function (results) {
                    return results;
                }).fail(function (badresults) {
                    prweb.log("prweb.datwebdata.updateDatResults promise fail..." + badresults);
                });
            }
            catch (ex) {
                prweb.log("prweb.datwebdata.updateDatResults try catch..." + badresults);
            }
        },

        incrementDatCountable: function (parsedat, dcelemid, options) {
            try{
                var params = {
                    datObjectId: parsedat.dat.objectId,
                    DatContentElementObjectID: dcelemid,
                    responseCount: 1
                };
                Parse.Cloud.run('updateDatResult', params).then(function (results) {
                    prweb.log("prweb.datwebdata.updateDatResult  " + results);
                }, function (badresults) {
                    prweb.log("prweb.datwebdata.updateDatResult error callback..." + badresults);
                });
                //Parse.Cloud.run('updateDatStatus', params).then(function (results) {
                //    prweb.log("prweb.datwebdata.updateDatStatus  " + results);
                //}, function (badresults) {
                //    prweb.log("prweb.datwebdata.updateDatStatus error callback..." + badresults);
                //});
            }
            catch(ex){
                prweb.log("datwebdata.incrementDatCountable reports  " + ex.message);
            }
            //try {
            //    var dcelem = Enumerable.From(parsedat.parsedcecolxn).Where(function (dce) { return dce.id == dcelemid }).FirstOrDefault();
            //    var datreply = new Parse.Object('DatReplies');
            //    datreply.set('replyUser',Parse.User.current());
            //    datreply.set('DatContentElementObjectID', dcelemid);
            //    datreply.set('responseCount', 1);
            //    datreply.save(null, {
            //        success: function () {
            //            parsedat.parsedatobj.relation('datReplies').add(datreply);
            //            dcelem.increment('responseCount');
            //            dcelem.save();
            //            //ultimatey need to increment dce and update the parent dat relation for datReplies....
            //            parsedat.parsedatobj.save();
            //            options.success();
            //        },
            //        error: function (e) {
            //            var xx = 2;
            //        }
            //    }); 

            //}
            //catch (ex) {
            //    alert("datwebdata.incrementDatCountable reports " + ex.message);
            //}

        },


        getWebResources: function (options) {
            try {
                var JSDatWebResources = {};
                var q = new Parse.Query('Resources');
                q.equalTo('platformId', 'Web');
                q.find({
                    success: function (resourcerows) {
                        var makejresrow = function (item) {
                            var jrow = item.toJSON();
                            JSDatWebResources[jrow.resourceType] = jrow;
                        };
                        Enumerable.From(resourcerows).ForEach(function (resrow) { return makejresrow(resrow) });
                        options.success(JSDatWebResources);
                    },
                    error: function (ex) {
                        prweb.log("prweb.datwebdata.getWebResources.find reports error..." + ex.message);
                        options.error(JSDatWebResources);
                    },
                });
            }
            catch (ex) {
                prweb.log("prweb.datwebdata.getWebResources reports " + ex.message);
            }
        },

    };


    /**
    * Datastore is responsible for persisting and providing data from 
    * the Data Manager.
    */
    prweb.dataStore = {
        /**
        * _data stores the data used by datastore's get and set methods
        * @private
        */
        _data: {},

        /**
        * Gets data from the datastore
        *
        * @param {string} token  An identifier for retrieving associated data
        */
        get: function (token) {
            return this._data[token];
        },

        /**
        * Persists data in the datastore
        *
        * @param {string} token    An identifier for the stored data
        * @param {mixed} payload   A blob of data
        */
        set: function (token, payload) {
            // Store the data
            this._data[token] = payload;
        },

        /**
        * Removes an item from the data store
        *
        * @param {string} token    An identifier for the stored data
        */
        clear: function (token) {
            try {
                this._data[token] = null;
                delete this._data[token];
            }
            catch (ex) {
                alert("prweb.dataStore.clear reports " + ex.Message);
            }
        },

        /**
        * Clears all data from the data store
        */
        clearAll: function () {
            this._data = {};
        }
    };

    /**
    * Data Manager is responsible for fetching data, storing it, 
    * and using callbacks to let callers know when that data is ready.
    */
    prweb.dataManager = {
        dataDefaults: {
            dataType: 'json',
            type: 'POST'
        },

        /**
        * When required, the data request URL will be modified to account for the 
        * webiste being deployed to a virtual directory instead of the website root. 
        *
        * Makes an ajax call to the specified endpoint to retrieve data.If sucessful 
        * stores the data in the data cache and calls the success callback.  
        *
        * This method mimics the options of $.ajax where appropriate.
        *
        * @param {object} options : Options object that maps to the ajax options object.
        *   this object must include the following fields:
        *       url : the url for the call
        *       success: a callback called on successful completion of the operation.
        */
        sendRequest: function (options) {
            // getRelativeEndpointUrl ensures the URL is relative to the website root.
            var datadflts = prweb.dataManager.dataDefaults,
                normalizedUrl = prweb.getRelativeEndpointUrl(options.url),
                cachedData = prweb.dataStore.get(normalizedUrl),
                callerOptions = $.extend({ cache: true }, datadflts, options, { url: normalizedUrl });

            if (callerOptions.cache && cachedData) {
                try {
                    options.success(cachedData);
                }
                catch (e) { alert("prweb.dataManager.sendRequest from cache reports error..."); }
                finally {
                    cachedData = null;
                    options.success = null;
                    delete options.success;
                    options.error = null;
                    delete options.error;
                    options = null;
                    datadflts = null;
                    normalizedUrl = null;
                    callerOptions.success = null;
                    delete callerOptions.success;
                    callerOptions.error = null;
                    delete callerOptions.error;
                    callerOptions = null;
                }
            }
            else {
                //if (prweb.pubsub) {
                //    prweb.pubsub.publish(prweb.events.status, {
                //        type: 'saving',
                //        message: 'Cloud access...',
                //        duration: 2000
                //    });
                //}
                callerOptions.success = function (data) {
                    if (callerOptions.cache) {
                        prweb.dataStore.set(normalizedUrl, data);
                    }
                    try {
                        options.success(data);
                    }
                    catch (e) { alert("prweb.dataManager.sendrequest non-cached reports error..."); }
                    finally {
                        options.success = null;
                        delete options.success;
                        options = null;
                        //                        cachedData = null;
                        datadflts = null;
                        normalizedUrl = null;
                        data = null;
                        callerOptions.success = null;
                        delete callerOptions.success;
                        callerOptions.error = null;
                        delete callerOptions.error;
                        callerOptions = null;
                    }
                };

                $.ajax(callerOptions);
            }
            return true;
        },


        cachedOnlyRequest: function (options) {
            // getRelativeEndpointUrl ensures the URL is relative to the website root.
            var that = prweb.dataManager,
                normalizedUrl = prweb.getRelativeEndpointUrl(options.url),
                cachedData = prweb.dataStore.get(normalizedUrl);

            if (cachedData) {
                options.success(cachedData);
                return;
            }
            else {
                options.error('not available in cache');
                return;
            }

        },
        /**
        * resetData will clear the specified data from the cache so subsequent calls
        * to get the data will result in returning to the server for the data
        */
        resetData: function (endpoint) {
            prweb.dataStore.clear(prweb.getRelativeEndpointUrl(endpoint));
        }
    };

}(this.prweb = this.prweb || {}, jQuery));