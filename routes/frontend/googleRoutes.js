const express = require("express");
const router = express.Router();
const {Account} = require("../../models/accounts");
const {google} = require('googleapis');
const { required } = require("joi");

const oauth2Client = new google.auth.OAuth2(
    process.env.OAUTH_CLIENT_ID,
    process.env.OAUTH_CLIENT_SECRET,
    process.env.REDIRECT_URL
  );
  
  const scopes = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'
  ];
  
  // Generate a url that asks permissions for the scope
  const authorizationUrl = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: 'offline',
    /** Pass in the scopes array defined above.
      * Alternatively, if only one scope is needed, you can pass a scope URL as a string */
    scope: scopes,
    prompt:'consent',
    // Enable incremental authorization. Recommended as a best practice.
    include_granted_scopes: true
  });

router.post("/google-signup",async (req,res)=>{
    res.redirect(authorizationUrl);
});

router.get("/callback/auth",async (req,res)=>{
  try{
  if(!req.query.code){
    res.redirect("/signup?err=error-during-google-signin");
    return;
  }
  const code = req.query.code;
  let { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  const service = google.people({
    version:"v1",
    auth: oauth2Client
  });
  const resp = await service.people.get({
    resourceName:"people/me",
    personFields: "emailAddresses"
  });
  const email = resp.data.emailAddresses[0].value;
  let user = await Account.findOne({ email: email });
  if(!user){
    req.session.email = email;
    res.redirect("/user/onboarding");
    return;
  }
  req.session.api = user._id;
  res.redirect("/dashboard");
}
catch(error){
  console.log(error);
  res.redirect("/error");
}
});

module.exports = router;