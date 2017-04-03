//var util = require('util');
//var _ = require('lodash');
var builder = require('botbuilder');
var restify = require('restify');
 
// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});
 
// Create chat bot
var connector = new builder.ChatConnector({
    //appId: '9df91066-6576-42b9-a9c9-4365c6b349da',
    //appPassword: 'cUUU9vRcPiozuS1kn9CBasx'
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
//server.post('https://qnaapp2.azurewebsites.net/api/messages', connector.listen());
server.post('/api/messages', connector.listen());

 
// Root dialog, triggers search and process its results
//bot.dialog('/', [
//    function (session) {
        // Trigger Search
//        session.beginDialog('searchqna2:/');
//    },
//    function (session, args) {
        // Process selected search results
//        session.send(
//            'Done! For future reference, you selected these properties: %s',
//            args.selection.map(i => i.key).join(', '));
//    }
//]);

//=========================================================
// Bots Global Actions
//=========================================================

bot.endConversationAction('goodbye', 'Goodbye :)', { matches: /^goodbye/i });
bot.beginDialogAction('help', '/help', { matches: /^help/i });

//=========================================================
// Bots Dialogs
//=========================================================

// Root dialog, triggers search and process its results
bot.dialog('/', [
    function (session) {
        // Send a greeting and show help.
        var card = new builder.HeroCard(session)
            .title("Knowledge Help Bot")
           // .text("Your bots - wherever your users are talking.")
            .images([
                 builder.CardImage.create(session, "http://www.blocally.com/bots/ey/techsupport/ey_logo.png")
            ]);
        var msg = new builder.Message(session).attachments([card]);
        session.send(msg);
        session.send("Hi... I'm a virtual member of the Knowledge Help team.  I'm an expert on our Knowledge tools.");
        session.beginDialog('/menu');
    },
    //function (session, results) {
        // Display menu
    //    session.beginDialog('/menu');
    //},
    function (session, results) {
        // Always say goodbye
        session.send("Ok... See you later!");
    }
]);

bot.dialog('/menu', [
    
    function (session) {

        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.HeroCard(session)
                    
                    .text("How can I help you today?  (Just type your question or use one of the buttons below)")
                    
                    .buttons([
                        builder.CardAction.dialogAction(session, "initialquestions", null, "What can I ask you?")
                        
                //        builder.CardAction.dialogAction(session, "speaktoadvisor", null, "How can I speak to an Advisor?")
                    ])
            ]);
        session.send(msg);
        //session.endDialog(msg);
    },
    function (session, results) {
        if (results.response && results.response.entity != '(quit)') {
            // Launch demo dialog
            session.beginDialog('/' + results.response.entity);
        } else {
            // Exit the menu
            session.endDialog();
        }
    },
    function (session, results) {
        // The menu runs a loop until the user chooses to (quit).
        session.replaceDialog('/menu');
    }
]).reloadAction('reloadMenu', null, { matches: /^menu|show menu/i });


bot.dialog('/initialquestions', [
    function (session) {
        builder.Prompts.choice(session, "What can I ask you?  Often, people ask me for help?", "Finding a research tool|Collaborating using SharePoint|Submitting knowledge|Help with EY Delivers*|Locating business info on Singapore or Malaysia companies*|Help using Factiva|What is Discover");
    },
    function (session, results) {
        if (results.response && results.response.entity != '(quit)') {
            // Launch demo dialog
            session.beginDialog('/' + results.response.entity);
        } else {
            // Exit the menu
            session.endDialog();
        }
    }
]);
bot.beginDialogAction('initialquestions', '/initialquestions'); 

bot.dialog('/speaktoadvisor', [
    function (session) {
        builder.Prompts.text(session, "I have access to a lot of the same information that our Knowledge Help team do, but if you'd rather deal with a human I understand.  Your local Knowledge Help team are available during business hours via a range of channels http://www.google.com.");
    }
]);
bot.beginDialogAction('speaktoadvisor', '/speaktoadvisor'); 






bot.dialog('/Help with EY Delivers*', [
    function (session) {
        builder.Prompts.choice(session, "Great! How can I help you with EY Delivers?", "I want to request a new site or follow up on a new site request|I need to arrange access to an existing site|I would like some help using EY Delivers|I am receiving an error message");
    },
    function (session, results) {
        if (results.response && results.response.entity != '(quit)') {
            // Launch demo dialog
            session.beginDialog('/' + results.response.entity);
        } else {
            // Exit the menu
            session.endDialog();
        }
    }
]);
bot.beginDialogAction('Help with EY Delivers*', '/Help with EY Delivers*'); 


bot.dialog('/Locating business info on Singapore or Malaysia companies*', [
    function (session) {

        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.HeroCard(session)
                    
                    .text("Questnet (www.questnet.sq) is a good source for obtaining digital copies of business profile reports and audited financial statements of companies in Singapore / Malaysia. Would you like to explore how to access Questnet content?")
                    
                    .buttons([
                        builder.CardAction.dialogAction(session, "questnet", null, "Yes"),
                        
                        builder.CardAction.dialogAction(session, "initialquestions", null, "No")
                    ])
            ]);
        session.send(msg);
        //session.endDialog(msg);
    }
]);
bot.beginDialogAction('Locating business info on Singapore or Malaysia companies*', '/Locating business info on Singapore or Malaysia companies*'); 



bot.dialog('/Help with Factiva', [
    function (session) {
        builder.Prompts.choice(session, "Factiva is one of our most popular External Sources and contains news and business information from over 32,000 sources.", "How do I build an effective search in Factiva|How can I set up alerts on my client or topic|Can Factiva find company, industry or executive profiles|How do I use Factiva quotes and charts?|Does Factiva have a mobile App?");
    },
    function (session, results) {
        if (results.response && results.response.entity != '(quit)') {
            // Launch demo dialog
            session.beginDialog('/' + results.response.entity);
        } else {
            // Exit the menu
            session.endDialog();
        }
    }
]);
bot.beginDialogAction('Help with Factiva', '/Help with Factiva'); 



bot.dialog('/What is Discover', [
    function (session) {
        builder.Prompts.choice(session, "Discover is EY's global knowledge portal, it connects you to documents, people and communities so that you can harness the knowledge and expertise of all of EY.", "How can I access EY Discover?|How is EY");
    },
    function (session, results) {
        if (results.response && results.response.entity != '(quit)') {
            // Launch demo dialog
            session.beginDialog('/' + results.response.entity);
        } else {
            // Exit the menu
            session.endDialog();
        }
    }
]);
bot.beginDialogAction('What is Discover', '/What is Discover'); 

bot.dialog('/Finding a research tool', [
    function (session) {

        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.HeroCard(session)
                    
                    .text("Finding a research tool")
                    
                    .buttons([
                        builder.CardAction.dialogAction(session, "account", null, "Yes"),
                        
                        builder.CardAction.dialogAction(session, "purchaseorfind", null, "No")
                    ])
            ]);
        session.send(msg);
        //session.endDialog(msg);
    }
]);
bot.beginDialogAction('Finding a research tool', '/Finding a research tool'); 














// Start EY Delivers


bot.dialog('/eydeliversmainmenu', [
    function (session) {
        builder.Prompts.choice(session, "How can we help you with EYDelivers?", "I want to request a new site or follow up on a new site request|I need to arrange access to an existing site|I am receiving an error message|I would like some help using EY Delivers|(quit)");
    },
    function (session, results) {
        if (results.response && results.response.entity != '(quit)') {
            // Launch demo dialog
            session.beginDialog('/' + results.response.entity);
        } else {
            // Exit the menu
            session.endDialog();
        }
    }
]);
bot.beginDialogAction('eydeliversmainmenu', '/eydeliversmainmenu');


bot.dialog('/I want to request a new site or follow up on a new site request', [
    function (session) {

        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.HeroCard(session)
                    
                    .text("Does this relate to an existing site or would you like to set up a new site?")
                    
                    .buttons([
                        builder.CardAction.dialogAction(session, "newsite", null, "New site"),
                        
                        builder.CardAction.dialogAction(session, "existingsite", null, "Existing site")
                    ])
            ]);
        session.send(msg);
        //session.endDialog(msg);
    }
]);
bot.beginDialogAction('I want to request a new site or follow up on a new site request', '/I want to request a new site or follow up on a new site request'); 


// existing site flow

bot.dialog('/existingsite', [
    function (session) {

        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.HeroCard(session)
                    
                    .text("Have you completed the Engagment Administrator eLearning in the last 48 hours?")
                    
                    .buttons([
                        builder.CardAction.dialogAction(session, "completedelearning", null, "Yes"),
                        
                        builder.CardAction.dialogAction(session, "notcompletedelearning", null, "No")
                    ])
            ]);
        session.send(msg);
        //session.endDialog(msg);
    }
]);
bot.beginDialogAction('existingsite', '/existingsite'); 



bot.dialog('/completedelearning', [
    
    function (session) {

        

        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.HeroCard(session)
                    
                    .text("If you submit an urgent site request within 48 hours of completing the eLearning please submit a copy of your Completion Diploma to the Client Portal Helpesk team (part of IT Services). Would you like me to help you to that?")
                    
                    .buttons([
                        builder.CardAction.dialogAction(session, "completiondiploma", null, "Yes"),
                        
                        builder.CardAction.dialogAction(session, "existingsitefailure", null, "No")
                    ])
                        
                        
                    
            ]);
        session.send(msg);
        //session.endDialog(msg);
    }
]);
bot.beginDialogAction('completedelearning', '/completedelearning');



bot.dialog('/completiondiploma', [
    
    function (session) {

        session.send("First let's retrieve your ‘Completion Diploma’ once you have passed the eLearning:• Go back in EYLeads to the Activity Details page for EYDelivers for Engagement Administrators• Scroll down in the lesson descriptionNovember 2016EYD V3.0EYDelivers: Request an EYD site QRG• Click on the diploma icon• Make a print screen of the diploma");

        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.HeroCard(session)
                    
                    .text("Do you know your Request ID? (this 4 or 5 digit ID is available from the EYDelivers Request and Tracking Site –My Requests feature)")
                    
                    .buttons([
                        builder.CardAction.dialogAction(session, "yesid", null, "Yes"),
                        
                        builder.CardAction.dialogAction(session, "noid", null, "No")
                    ])
                        
                        
                    
            ]);
        session.send(msg);
        //session.endDialog(msg);
    }
]);
bot.beginDialogAction('completiondiploma', '/completiondiploma');




bot.dialog('/noid', [
    function (session) {
     //   session.send("Good choice! You'll soon be able to access Questnet reports directly.  I just need to collect 3 pieces of info from you to be able to generate a username and password.");
        builder.Prompts.text(session, "Please enter your EY email address.");
    },
    

    function (session, results) {
  //      session.send("You can send a receipts for purchased good with both images and without...");
        session.send("You entered '%s'", results.response);
        session.userData.email = results.response;
        var msg = new builder.Message(session)
            .attachments([
                new builder.ReceiptCard(session)
                    .title("EY Delivers Request")
                    //.items([
                   //     builder.ReceiptItem.create(session, "$22.00", "Screen shot").image(builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/commons/a/a0/Night_Exterior_EMP.jpg"))
                   //     builder.ReceiptItem.create(session, "$22.00", "Space Needle").image(builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/commons/7/7c/Seattlenighttimequeenanne.jpg"))
                  //  ])
                    .facts([
                        
                      //  builder.Fact.create(session, "" + session.userData.requestid + "", "Request ID"),
                        builder.Fact.create(session, "" + session.userData.email + "", "Email Address")
                                               
                    ])
                  
            ]);
        session.send(msg);
        session.beginDialog('/requestsubmit');

        
        
    }

    
    
    
]);
bot.beginDialogAction('noid', '/noid');   // <-- no 'matches' option means this can only be triggered by a button.




bot.dialog('/yesid', [
    function (session) {
     //   session.send("Good choice! You'll soon be able to access Questnet reports directly.  I just need to collect 3 pieces of info from you to be able to generate a username and password.");
        builder.Prompts.number(session, "Please enter the request ID.");
    },
    function (session, results) {
        session.send("You entered '%s'", results.response);
        session.userData.requestid = results.response;
        builder.Prompts.text(session, "And what is your EY email address?");
    },
    function (session, results) {
        session.send("You entered '%s'", results.response);
        session.userData.email = results.response;
        
   
        
        var msg = new builder.Message(session)
            .attachments([
                new builder.ReceiptCard(session)
                    .title("EY Delivers Request")
                    //.items([
                   //     builder.ReceiptItem.create(session, "$22.00", "Screen shot").image(builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/commons/a/a0/Night_Exterior_EMP.jpg"))
                   //     builder.ReceiptItem.create(session, "$22.00", "Space Needle").image(builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/commons/7/7c/Seattlenighttimequeenanne.jpg"))
                  //  ])
                    .facts([
                        
                        builder.Fact.create(session, "" + session.userData.requestid + "", "Request ID"),
                        builder.Fact.create(session, "" + session.userData.email + "", "Email Address")
                                               
                    ])
                  
            ]);
        session.send(msg);
        session.beginDialog('/requestsubmit');

        
        
    }

    
    
    
]);
bot.beginDialogAction('yesid', '/yesid');   // <-- no 'matches' option means this can only be triggered by a button.



bot.dialog('/requestsubmit', [
    
    
    function (session) {


        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.HeroCard(session)
                    
                    .text("Would you like to submit this information now?")
                    
                    .buttons([
                        //builder.CardAction.dialogAction(session, "ticketcomplete", null, "Yes"),
                        builder.CardAction.dialogAction(session, "sendemailrequest", null, "Yes"),
                        
                        builder.CardAction.dialogAction(session, "", null, "No")
                    ])
            ]);
        session.send(msg);
        //session.endDialog(msg);
    }
    
]);
bot.beginDialogAction('requestsubmit', '/requestsubmit');   // <-- no 'matches' option means this can only be triggered by a button.




bot.dialog('/sendemailrequest', [
    
    function (session) {
        session.send("Send email containing info to test address (eyknowledgehelpsurvey@ey.com)");
        
    }
]);
bot.beginDialogAction('sendemailrequest', '/sendemailrequest');














bot.dialog('/notcompletedelearning', [
    
    function (session) {

        session.send("An Engagement Administrator (EA) is a “super-user” of the engagement who has completed mandatory eLearning. An EA has full access to everything in the engagement, has special admin only rights and is the first point of contact for usage questions by team members. It is recommended to have at least two EAs identified for each engagement.");

        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.HeroCard(session)
                    
                    .text("Does this help?")
                    
                    .buttons([
                        builder.CardAction.dialogAction(session, "exisitngsiterequestsuccess", null, "Yes"),
                        
                        builder.CardAction.dialogAction(session, "existingsitefailure", null, "No")
                    ])
                        
                        
                    
            ]);
        session.send(msg);
        //session.endDialog(msg);
    }
]);
bot.beginDialogAction('notcompletedelearning', '/notcompletedelearning');


bot.dialog('/exisitngsiterequestsuccess', [
    
    function (session) {

        session.send("New site request success!");

        
    }
]);
bot.beginDialogAction('exisitngsiterequestsuccess', '/exisitngsiterequestsuccess');

bot.dialog('/existingsitefailure', [
    
    function (session) {

        session.send("Sorry that I’ve not been able to answer your question here. There is more comprehensive support on our EYDelivers tools page or you may like to contact your local Knowledge Help team(see links) or ask your question in the EYD/WPP Yammer group");

        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.HeroCard(session)
                    
                    .text("New Site Request Failure")
                    
                    //.buttons([
                    //    builder.CardAction.dialogAction(session, "newsiterequestsuccess", null, "Yes"),
                        
                   //     builder.CardAction.dialogAction(session, "newsitefailure", null, "No")
                   // ])
                        
                        
                    
            ]);
        session.send(msg);
        //session.endDialog(msg);
    }
]);
bot.beginDialogAction('existingsitefailure', '/existingsitefailure');



// End existing site flow




// new site flow
bot.dialog('/newsite', [
    
    function (session) {

        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.HeroCard(session)
                    
                    .text("New sites can be requested using the [EYDelivers Request & Tracking site](https://eyd-us.ey.com/sites/eydelivers_rts/RTSDefaultPages/)(we have a quick reference guide available [here](https://eyd-us.ey.com/sites/eydelivers_rts/RTSDefaultPages/). As EYDelivers sites can be made available to clients and third parties sites it’s important they’re managed by a trained member of the Engagement Team (called an Engagement Administrator). A site can’t be created until the Engagement Administrators listed on the request have completed the mandatory eLearningand achieve a passing score of 70%")
                    
                    .buttons([
                        builder.CardAction.dialogAction(session, "newsitemessage2", null, "Next message")
                        
                        
                    ])
            ]);
        session.send(msg);
        //session.endDialog(msg);
    }
]);
bot.beginDialogAction('newsite', '/newsite');


bot.dialog('/newsitemessage2', [
    
    function (session) {

        session.send("An Engagement Administrator (EA) is a “super-user” of the engagement who has completed mandatory eLearning. An EA has full access to everything in the engagement, has special admin only rights and is the first point of contact for usage questions by team members. It is recommended to have at least two EAs identified for each engagement.");

        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.HeroCard(session)
                    
                    .text("Does this help?")
                    
                    .buttons([
                        builder.CardAction.dialogAction(session, "newsiterequestsuccess", null, "Yes"),
                        
                        builder.CardAction.dialogAction(session, "requestreferenceguide", null, "No")
                    ])
                        
                        
                    
            ]);
        session.send(msg);
        //session.endDialog(msg);
    }
]);
bot.beginDialogAction('newsitemessage2', '/newsitemessage2');



bot.dialog('/requestreferenceguide', [
    
    function (session) {

        session.send("You may like to review our “Request an EYD site quick reference guide” - http://chs.ey.net/servlet/CHSRenderingServlet?chsReplicaID=852576F00003462C&contentID=LP-8C1E1313DF94999185257C7D0067F087");

        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.HeroCard(session)
                    
                    .text("Does this help?")
                    
                    .buttons([
                        builder.CardAction.dialogAction(session, "newsiterequestsuccess", null, "Yes"),
                        
                        builder.CardAction.dialogAction(session, "newsitefailure", null, "No")
                    ])
                        
                        
                    
            ]);
        session.send(msg);
        //session.endDialog(msg);
    }
]);
bot.beginDialogAction('requestreferenceguide', '/requestreferenceguide');


bot.dialog('/newsiterequestsuccess', [
    
    function (session) {

        session.send("New site request success!");

        
    }
]);
bot.beginDialogAction('newsiterequestsuccess', '/newsiterequestsuccess');

bot.dialog('/newsitefailure', [
    
    function (session) {

        session.send("Sorry that I’ve not been able to answer your question here. There is more comprehensive support on our EYDelivers tools page or you may like to contact your local Knowledge Help team(see links) or ask your question in the EYD/WPP Yammer group");

        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.HeroCard(session)
                    
                    .text("New Site Request Failure")
                    
                    //.buttons([
                    //    builder.CardAction.dialogAction(session, "newsiterequestsuccess", null, "Yes"),
                        
                   //     builder.CardAction.dialogAction(session, "newsitefailure", null, "No")
                   // ])
                        
                        
                    
            ]);
        session.send(msg);
        //session.endDialog(msg);
    }
]);
bot.beginDialogAction('newsitefailure', '/newsitefailure');



// end new or existing flow







// arrange access flow

bot.dialog('/I need to arrange access to an existing site', [
    function (session) {

        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.HeroCard(session)
                    
                    .text("Do you want to grant access for An EY employee or an external client or third party?")
                    
                    .buttons([
                        builder.CardAction.dialogAction(session, "eyemployee", null, "EY employee"),
                        
                        builder.CardAction.dialogAction(session, "externalclient", null, "external client or third party")
                    ])
            ]);
        session.send(msg);
        //session.endDialog(msg);
    }
]);
bot.beginDialogAction('I need to arrange access to an existing site', '/I need to arrange access to an existing site for EY staff'); 


bot.dialog('/externalclient', [
    function (session) {
        //session.send("Please contact your Engagment Administrator to arrange access. You will find the Engament Administrators names on the site's Engagement Form, which you can open by clicking on the engagement name in Request & Tracking Site (RTS) Active Engagements view. From your EYDelivers site you can also find the contacts via the Ressources link under Eng. & Project Admin.");

        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.HeroCard(session)
                    
                    .text("For clients and third parties to access EYDelivers they first require a Client Portal account. I can help you organise that. Would you like to arrange access for one person or multiple people?")
                    
                    .buttons([
                        builder.CardAction.dialogAction(session, "oneperson", null, "One"),
                        
                        builder.CardAction.dialogAction(session, "multiplepeople", null, "Multiple")
                    ])
            ]);
        session.send(msg);
        //session.endDialog(msg);
    }
]);
bot.beginDialogAction('externalclient', '/externalclient'); 


bot.dialog('/multiplepeople', [
    function (session) {
        session.send("If you are requesting access for multiple users, complete this Excel formand send it to Client Portal Helpdesk clientportal@ey.com.");

        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.HeroCard(session)
                    
                    .text("Does this help?")
                    
                    .buttons([
                        builder.CardAction.dialogAction(session, "accessrequestsuccess", null, "Yes"),
                        
                        builder.CardAction.dialogAction(session, "accessrequestfailure2", null, "No")
                    ])
            ]);
        session.send(msg);
        //session.endDialog(msg);
    }
]);
bot.beginDialogAction('multiplepeople', '/multiplepeople'); 

bot.dialog('/accessrequestfailure2', [
    function (session) {

       // session.send("Sorry that I’ve not been able to answer your question here, however there is more comprehensive support on our EYD tools page or you may like to contact the Client Portal Helpesk or your Engagment Admin.");
        session.send("Access Request Failure.");

    }   
]);
bot.beginDialogAction('accessrequestfailure2', '/accessrequestfailure2'); 




bot.dialog('/oneperson', [
    function (session) {
     //   session.send("Good choice! You'll soon be able to access Questnet reports directly.  I just need to collect 3 pieces of info from you to be able to generate a username and password.");
        builder.Prompts.text(session, "Please enter the client company name (or EY if you are staff)");
    },
    function (session, results) {
        session.send("You entered '%s'", results.response);
        session.userData.companyname = results.response;
        builder.Prompts.text(session, "And what is your full name?");
    },
    function (session, results) {
        session.send("You entered '%s'", results.response);
        session.userData.name = results.response;
        builder.Prompts.text(session, "What is your full external email address?");
        
    },
    function (session, results) {
        session.send("You entered '%s'", results.response);
        session.userData.email = results.response;
        builder.Prompts.text(session, "What is your job title?");
    },
    function (session, results) {
        session.send("You entered '%s'", results.response);
        session.userData.jobtitle = results.response;
        builder.Prompts.number(session, "What is your contact number?");
        
    },
    function (session, results) {
        session.send("You entered '%s'", results.response);
        session.userData.contactnumber = results.response;
        builder.Prompts.text(session, "Finally, please enter the content/tools required (eg eRoom, EYDelivers)");
    },
    
    function (session, results) {
  //      session.send("You can send a receipts for purchased good with both images and without...");
        session.send("You entered '%s'", results.response);
        session.userData.tools = results.response;
        
        var msg = new builder.Message(session)
            .attachments([
                new builder.ReceiptCard(session)
                    .title("Client Portal Access")
                    .items([
                   //     builder.ReceiptItem.create(session, "$22.00", "Screen shot").image(builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/commons/a/a0/Night_Exterior_EMP.jpg"))
                   //     builder.ReceiptItem.create(session, "$22.00", "Space Needle").image(builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/commons/7/7c/Seattlenighttimequeenanne.jpg"))
                    ])
                    .facts([
                        
                        builder.Fact.create(session, "" + session.userData.companyname + "", "Company Name"),
                        builder.Fact.create(session, "" + session.userData.name + "", "Name"),
                        
                        builder.Fact.create(session, "" + session.userData.email + "", "Email Address"),
                        builder.Fact.create(session, "" + session.userData.jobtitle + "", "Job Title"),
                        builder.Fact.create(session, "" + session.userData.contactnumber + "", "Contact Number"),
                        builder.Fact.create(session, "" + session.userData.tools + "", "Tools Required")

                                               
                    ])
                  
            ]);
        session.send(msg);
        session.beginDialog('/addanother');

        
        
    }

    
    
    
]);
bot.beginDialogAction('oneperson', '/oneperson');   // <-- no 'matches' option means this can only be triggered by a button.



bot.dialog('/addanother', [
    
    
    function (session) {


        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.HeroCard(session)
                    
                    .text("Would you like to set up another?")
                    
                    .buttons([
                        
                        builder.CardAction.dialogAction(session, "oneperson", null, "Yes"),
                        
                        builder.CardAction.dialogAction(session, "sendaccessrequest", null, "No")
                    ])
            ]);
        session.send(msg);
        //session.endDialog(msg);
    }
    
]);
bot.beginDialogAction('addanother', '/addanother');   // <-- no 'matches' option means this can only be triggered by a button.




bot.dialog('/sendaccessrequest', [
    
    function (session) {
        session.send("Your request has been sent to the Client Portal team and will be actioned within XXhours.");
        session.beginDialog('/sendemailrequest');
    },
    
]);
bot.beginDialogAction('sendaccessrequest', '/sendaccessrequest');





bot.dialog('/eyemployee', [
    function (session) {
        session.send("Please contact your Engagment Administrator to arrange access. You will find the Engament Administrators names on the site's Engagement Form, which you can open by clicking on the engagement name in Request & Tracking Site (RTS) Active Engagements view. From your EYDelivers site you can also find the contacts via the Ressources link under Eng. & Project Admin.");

        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.HeroCard(session)
                    
                    .text("Does this help?")
                    
                    .buttons([
                        builder.CardAction.dialogAction(session, "accessrequestsuccess", null, "Yes"),
                        
                        builder.CardAction.dialogAction(session, "accessrequestfailure", null, "No")
                    ])
            ]);
        session.send(msg);
        //session.endDialog(msg);
    }
]);
bot.beginDialogAction('eyemployee', '/eyemployee'); 


bot.dialog('/accessrequestsuccess', [
    function (session) {
        session.send("Access Request Success.");

    }   
]);
bot.beginDialogAction('accessrequestsuccess', '/accessrequestsuccess'); 



bot.dialog('/accessrequestfailure', [
    function (session) {

        session.send("Sorry that I’ve not been able to answer your question here, however there is more comprehensive support on our EYD tools page or you may like to contact the Client Portal Helpesk or your Engagment Admin.");
        session.send("Access Request Failure.");

    }   
]);
bot.beginDialogAction('accessrequestfailure', '/accessrequestfailure'); 





// end arrange access flow











// receiving errors flow



bot.dialog('/I am receiving an error message', [
    function (session) {

        session.send("Does you error message match any of these?");

        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.HeroCard(session)
                    
                    .text("Your client does not support opening this list with Windows Explorer. Secure Proxy Server -Error Report. Page cannot be displayed. Unable to submit Request and Tracking Site (RTS) form to request a site.")
                    
                    .buttons([
                        builder.CardAction.dialogAction(session, "yeskb", null, "Yes"),
                        
                        builder.CardAction.dialogAction(session, "nokb", null, "No")
                    ])
            ]);
        session.send(msg);
        //session.endDialog(msg);
    }
]);
bot.beginDialogAction('I am receiving an error message', '/I am receiving an error message'); 


bot.dialog('/yeskb', [
    function (session) {

        session.send("View the knowledge article - https://ey.service-now.com/kb_view.do?sysparm_article=KB0218016");

        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.HeroCard(session)
                    
                    .text("Does this help?")
                    
                    .buttons([
                        builder.CardAction.dialogAction(session, "knownissuesuccess", null, "Yes"),
                        
                        builder.CardAction.dialogAction(session, "knownissuefailure", null, "No")
                    ])
            ]);
        session.send(msg);
        //session.endDialog(msg);
    }
]);
bot.beginDialogAction('yeskb', '/yeskb'); 

bot.dialog('/nokb', [
    function (session) {

        session.send("View the knowledge article - https://ey.service-now.com/kb_view.do?sysparm_article=KB0090786");

        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.HeroCard(session)
                    
                    .text("Does this help?")
                    
                    .buttons([
                        builder.CardAction.dialogAction(session, "knownissuesuccess", null, "Yes"),
                        
                        builder.CardAction.dialogAction(session, "knownissuefailure", null, "No")
                    ])
            ]);
        session.send(msg);
        //session.endDialog(msg);
    }
]);
bot.beginDialogAction('nokb', '/nokb'); 



bot.dialog('/knownissuesuccess', [
    function (session) {
        session.send("Access Request Success.");

    }   
]);
bot.beginDialogAction('knownissuesuccess', '/knownissuesuccess'); 



bot.dialog('/knownissuefailure', [
    function (session) {

        session.send("Sorry that I’ve not been able to solve your issue here, IT Services provide technical support for EYDelivers. Please call your local IT Service Desk or use the IT Self-Service portalto chat with a technician or log a ticket.");
        session.send("Access Request Failure.");

    }   
]);
bot.beginDialogAction('knownissuefailure', '/knownissuefailure'); 



// end receiving errors flow



// I'd like some help flow

bot.dialog('/I would like some help using EY Delivers', [
  //  function (session) {
        // Trigger Search
  //      session.beginDialog('searchqna2:/');
  //  },
  //  function (session, args) {
        // Process selected search results
   //     session.send(
  //          'Done! For future reference, you bookmarked the following questions: %s',
  //          args.selection.map(i => i.key).join(', '));
  //  }
  function (session) {

        session.send("How may I help you?");

    }   

]);
 




// I'd like some help flow


// End EY Delivers











// Start Questnet App

// Root dialog, triggers search and process its results
bot.dialog('/questnet', [
    function (session) {
        // Send a greeting and show help.
        var card = new builder.HeroCard(session)
            .title("Questnet Bot")
           // .text("Your bots - wherever your users are talking.")
            .images([
                 builder.CardImage.create(session, "http://www.blocally.com/bots/ey/techsupport/ey_logo.png")
            ]);
        var msg = new builder.Message(session).attachments([card]);
        session.send(msg);
        session.send("Hi... I'm the Questnet Bot. I can help  you ... and answer your FAQs.");
        session.beginDialog('/questnetmenu');
    },
    //function (session, results) {
        // Display menu
    //    session.beginDialog('/menu');
    //},
    function (session, results) {
        // Always say goodbye
        session.send("Ok... See you later!");
    }
]);
bot.beginDialogAction('questnet', '/questnet'); 

bot.dialog('/questnetmenu', [
    
    function (session) {

        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.HeroCard(session)
                    
                    .text("Are you looking for information on a Singapore or Malaysian company?")
                    
                    .buttons([
                        builder.CardAction.dialogAction(session, "questnetinfo", null, "Yes"),
                        
                        builder.CardAction.dialogAction(session, "help", null, "No")
                    ])
            ]);
        session.send(msg);
        //session.endDialog(msg);
    },
    function (session, results) {
        if (results.response && results.response.entity != '(quit)') {
            // Launch demo dialog
            session.beginDialog('/' + results.response.entity);
        } else {
            // Exit the menu
            session.endDialog();
        }
    },
    function (session, results) {
        // The menu runs a loop until the user chooses to (quit).
        session.replaceDialog('/questnetmenu');
    }
]);
bot.beginDialogAction('questnetmenu', '/questnetmenu'); 

bot.dialog('/help', [
    function (session) {
        session.endDialog("Global commands that are available anytime:\n\n* menu - Exits a demo and returns to the menu.\n* goodbye - End this conversation.\n* help - Displays these commands.");
    }
]);

// Create a service tickets flow

bot.dialog('/questnetinfo', [
    function (session) {

        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.HeroCard(session)
                    
                    .text("Questnet is a good source for obtaining digital copies of business profile reports and audited financial statements of companies in Singapore / Malaysia. Would you like to explore how to access Questnet content?")
                    
                    .buttons([
                        builder.CardAction.dialogAction(session, "location", null, "Yes"),
                        
                        builder.CardAction.dialogAction(session, "howtohelp", null, "No")
                    ])
            ]);
        session.send(msg);
        //session.endDialog(msg);
    }
]);
bot.beginDialogAction('questnetinfo', '/questnetinfo'); 




bot.dialog('/location', [
    function (session) {

        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.HeroCard(session)
                    
                    .text("Are you based in Singapore or Malaysia?")
                    
                    .buttons([
                        builder.CardAction.dialogAction(session, "account", null, "Yes"),
                        
                        builder.CardAction.dialogAction(session, "purchaseorfind", null, "No")
                    ])
            ]);
        session.send(msg);
        //session.endDialog(msg);
    }
]);
bot.beginDialogAction('location', '/location'); 

bot.dialog('/purchaseorfind', [
    function (session) {

        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.HeroCard(session)
                    
                    .text("Would you like us to find it for you or purchase yourself with a credit card?")
                    
                    .buttons([
                        builder.CardAction.dialogAction(session, "acrachargecodequestions", null, "Find it myself"),
                        
                        builder.CardAction.dialogAction(session, "creditcard", null, "Purchase with cc")
                    ])
            ]);
        session.send(msg);
        //session.endDialog(msg);
    }
]);
bot.beginDialogAction('purchaseorfind', '/purchaseorfind'); 



bot.dialog('/creditcard', [
    function (session) {

        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.HeroCard(session)
                    
                    .text("You can find guidance for how to use your credit card to set up a personal account by clicking the button below")
                    
                    .buttons([
                        builder.CardAction.dialogAction(session, "http://chs.ey.net/servlet/CHSRenderingServlet?contentlD=CT-BB", null, "Use cc for personal account")
                    ])
            ]);
        session.send(msg);
        //session.endDialog(msg);
        session.beginDialog('/waitforaccount');
    }
]);
bot.beginDialogAction('creditcard', '/creditcard'); 

bot.dialog('/account', [
    function (session) {

        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.HeroCard(session)
                    
                    .text("If you are working on a project for Singapore/Malaysia with a Singapore/Malaysia charge code and are located in Singapore/Malaysia I can either set you up with a Questnet account or organise for the report to be retreived for you.  If your request is not a one off, I recommend you request your own Questnet account.  Would you like an account?")
                    
                    .buttons([
                        builder.CardAction.dialogAction(session, "chargecodequestions", null, "Yes"),
                        
                        builder.CardAction.dialogAction(session, "acrachargecodequestions", null, "No")
                    ])
            ]);
        session.send(msg);
        //session.endDialog(msg);
    }
]);
bot.beginDialogAction('account', '/account');

bot.dialog('/chargecodequestions', [
    function (session) {
        session.send("Good choice! You'll soon be able to access Questnet reports directly.  I just need to collect 3 pieces of info from you to be able to generate a username and password.");
        builder.Prompts.text(session, "Please enter your EY email address.");
    },
    function (session, results) {
        session.send("You entered '%s'", results.response);
        session.userData.email = results.response;
        builder.Prompts.text(session, "And what is your contact number?");
    },
    function (session, results) {
        session.send("You entered '%s'", results.response);
        session.userData.phonenumber = results.response;
        builder.Prompts.text(session, "Lastly, please enter your charge code (Questnet charges a variable fee based on the type of report that is downloaded).");
        //session.beginDialog('/sendemail');
    },
    

    function (session, results) {
  //      session.send("You can send a receipts for purchased good with both images and without...");
        session.send("You entered '%s'", results.response);
        session.userData.chargecode = results.response;
        // Send a receipt with images
        var msg = new builder.Message(session)
            .attachments([
                new builder.ReceiptCard(session)
                    .title("Questnet Account Request")
                    .items([
                   //     builder.ReceiptItem.create(session, "$22.00", "Screen shot").image(builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/commons/a/a0/Night_Exterior_EMP.jpg"))
                   //     builder.ReceiptItem.create(session, "$22.00", "Space Needle").image(builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/commons/7/7c/Seattlenighttimequeenanne.jpg"))
                    ])
                    .facts([
                        builder.Fact.create(session, "SR1234567898", "Ticket Number"),
                        builder.Fact.create(session, "" + session.userData.email + "", "Email Address"),
                       
                        builder.Fact.create(session, "" + session.userData.phonenumber + "", "Phone Number"),
                        builder.Fact.create(session, "" + session.userData.chargecode + "", "Charge Code")
                        
                    ])
                  //  .tax("$4.40")
                  //  .total("$48.40")
            ]);
        session.send(msg);
        session.beginDialog('/ticketsubmit');

        
        
    }

    
    
    
]);
bot.beginDialogAction('chargecodequestions', '/chargecodequestions');   // <-- no 'matches' option means this can only be triggered by a button.



bot.dialog('/ticketsubmit', [
    
    
    function (session) {
//        builder.Prompts.choice(session, "What demo would you like to run?", "ticket|prompts|picture|cards|list|carousel|receipt|actions|(quit)");
//		builder.Prompts.choice(session, "How may I help you?", "ticket|cards|carousel|receipt|actions|(quit)");

        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.HeroCard(session)
                    
                    .text("Would you like to submit this information now?")
                    
                    .buttons([
                        //builder.CardAction.dialogAction(session, "ticketcomplete", null, "Yes"),
                        builder.CardAction.dialogAction(session, "sendemail", null, "Yes"),
                        
                        builder.CardAction.dialogAction(session, "receipt", null, "No")
                    ])
            ]);
        session.send(msg);
        //session.endDialog(msg);
    }
    
]);
bot.beginDialogAction('ticketsubmit', '/ticketsubmit');   // <-- no 'matches' option means this can only be triggered by a button.


bot.dialog('/ticketcomplete', [
    function (session) {
        session.endDialog("Please note it can take between one and three days to receive your username and password.  If you don't yet have your own login details and your request is urgent EY Knowledge can still find reports for you until it arrives.");
        
    }
    
]);
bot.beginDialogAction('ticketcomplete', '/ticketcomplete');   // <-- no 'matches' option means this can only be triggered by a button.

bot.dialog('/sendemail', [
    //function (session) {
    //    session.send("Please note it can take between one and three days to receive your username and password.  If you don't yet have your own login details and your request is urgent EY Knowledge can still find reports for you until it arrives.");
        
    //},
    function (session) {
        session.send("Please note it can take between one and three days to receive your username and password.  If you don't yet have your own login details and your request is urgent EY Knowledge can still find reports for you until it arrives.");
        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.HeroCard(session)
                    
                    .text("Would you like to wait for your account or is your request urgent?")
                    
                    .buttons([
                        builder.CardAction.dialogAction(session, "acrachargecodequestions", null, "Urgent"),
                        
                        builder.CardAction.dialogAction(session, "waitforaccount", null, "Wait")
                    ])
            ]);
        session.send(msg);
        //session.endDialog(msg);
    }
]);
bot.beginDialogAction('sendemail', '/sendemail');



bot.dialog('/acrachargecodequestions', [
    function (session) {
        //session.send("Good choice! You'll soon be able to access Questnet reports directly.  I just need to collect 3 pieces of info from you to be able to generate a username and password.");
        builder.Prompts.text(session, "Please specify the ACRA registration/entity number.");
    },
    function (session, results) {
        session.send("You entered '%s'", results.response);
        session.userData.acraregistration = results.response;
        builder.Prompts.text(session, "And what is the charge code you'd like to use to purchase the report(s)?  We'll ensure a quick turnaround for your request.");
    },
    
    

    function (session, results) {
  //      session.send("You can send a receipts for purchased good with both images and without...");
        session.send("You entered '%s'", results.response);
        session.userData.acrachargecode = results.response;
        // Send a receipt with images
        var msg = new builder.Message(session)
            .attachments([
                new builder.ReceiptCard(session)
                    .title("Questnet Account Request")
                    .items([
                   //     builder.ReceiptItem.create(session, "$22.00", "Screen shot").image(builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/commons/a/a0/Night_Exterior_EMP.jpg"))
                   //     builder.ReceiptItem.create(session, "$22.00", "Space Needle").image(builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/commons/7/7c/Seattlenighttimequeenanne.jpg"))
                    ])
                    .facts([
                        builder.Fact.create(session, "SR1234567898", "Ticket Number"),
                        builder.Fact.create(session, "" + session.userData.acraregistration + "", " ACRA Registration Number"),
                       
                        builder.Fact.create(session, "" + session.userData.acrachargecode + "", "Charge Code")
                        
                        
                    ])
                  //  .tax("$4.40")
                  //  .total("$48.40")
            ]);
        session.send(msg);
        session.beginDialog('/acraticketsubmit');

        
        
    }

    
    
    
]);
bot.beginDialogAction('acrachargecodequestions', '/acrachargecodequestions');   // <-- no 'matches' option means this can only be triggered by a button.



bot.dialog('/acraticketsubmit', [
    
    
    function (session) {
        session.send("These requests are handled by a researcher who is located in Sydney, Monday-Wednesday 9:00am-3:30pm and Thursday before 11:30am if your query is more urgent please contact Knowledge Help quoting message urgent-questnet-bot.");
//		builder.Prompts.choice(session, "How may I help you?", "ticket|cards|carousel|receipt|actions|(quit)");

        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.HeroCard(session)
                    
                    .text("Has your issue been resolved?")
                    
                    .buttons([
                        //builder.CardAction.dialogAction(session, "ticketcomplete", null, "Yes"),
                        builder.CardAction.dialogAction(session, "acrasuccess", null, "Yes"),
                        
                        builder.CardAction.dialogAction(session, "acrafailure", null, "No")
                    ])
            ]);
        session.send(msg);
        //session.endDialog(msg);
    }
    
]);
bot.beginDialogAction('acraticketsubmit', '/acraticketsubmit');   // <-- no 'matches' option means this can only be triggered by a button.

bot.dialog('/acrasuccess', [
    function (session) {
        session.endDialog("Success!");
    }
]);
bot.beginDialogAction('acrasuccess', '/acrasuccess'); 

bot.dialog('/acrafailure', [
    function (session) {
        session.endDialog("Failure!");
    }
]);
bot.beginDialogAction('acrafailure', '/acrafailure'); 

bot.dialog('/acraticketcomplete', [
    function (session) {
//        builder.Prompts.choice(session, "What demo would you like to run?", "ticket|prompts|picture|cards|list|carousel|receipt|actions|(quit)");
//		builder.Prompts.choice(session, "How may I help you?", "ticket|cards|carousel|receipt|actions|(quit)");

        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.HeroCard(session)
                    
                    .text("")
                    
                    .buttons([
                        //builder.CardAction.dialogAction(session, "ticketcomplete", null, "Yes"),
                        builder.CardAction.dialogAction(session, "acraticketcomplete", null, "Yes"),
                        
                        builder.CardAction.dialogAction(session, "acrachargecodequestions", null, "No")
                    ])
            ]);
        session.send(msg);
        //session.endDialog(msg);
    }
    
]);
bot.beginDialogAction('acraticketcomplete', '/acraticketcomplete');   // <-- no 'matches' option means this can only be triggered by a button.

bot.dialog('/waitforaccount', [
    
    
    function (session) {
        //session.send("These requests are handled by a researcher who is located in Sydney, Monday-Wednesday 9:00am-3:30pm and Thursday before 11:30am if your query is more urgent please contact Knowledge Help quoting message urgent-questnet-bot.");
//		builder.Prompts.choice(session, "How may I help you?", "ticket|cards|carousel|receipt|actions|(quit)");

        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.HeroCard(session)
                    
                    .text("Has your issue been resolved?")
                    
                    .buttons([
                        //builder.CardAction.dialogAction(session, "ticketcomplete", null, "Yes"),
                        builder.CardAction.dialogAction(session, "waitsuccess", null, "Yes"),
                        
                        builder.CardAction.dialogAction(session, "waitfailure", null, "No")
                    ])
            ]);
        session.send(msg);
        //session.endDialog(msg);
    }
    
]);
bot.beginDialogAction('waitforaccount', '/waitforaccount');   // <-- no 'matches' option means this can only be triggered by a button.

bot.dialog('/waitsuccess', [
    function (session) {
        session.endDialog("Success!");
    }
]);
bot.beginDialogAction('waitsuccess', '/waitsuccess'); 

bot.dialog('/waitfailure', [
    function (session) {

        session.endDialog("I'm sorry I've not been able to help.  You might find our Questnet user manual helpful or your local Knowledge Help Team will be happy to assist you.");
    }
]);
bot.beginDialogAction('waitfailure', '/waitfailure'); 

bot.dialog('/howtohelp', [
    function (session) {
        session.endDialog("How else can I help you? Global commands that are available anytime:\n\n* menu - Exits a demo and returns to the menu.\n* goodbye - End this conversation.\n* help - Displays these commands.");
    }
]);
bot.beginDialogAction('howtohelp', '/howtohelp'); 


// END Questnet FLOW 


 


server.get('/', restify.serveStatic({
 directory: __dirname,
 default: '/index.html'
}));