var express = require('express');
var router = express.Router();
var userHelpers = require('../helpers/user-helpers');

/* Session */

const verifyLogin = (req, res, next) => {
  if (req.session.user) {
    next()
  } else {
    res.redirect('/login')
  }
}

function keepAlive() {
  console.log("Node.js is active!");
}

const interval = setInterval(keepAlive, 4 * 60 * 1000);

/* GET home page. */
router.get('/', async function (req, res, next) {
  if (req.session.user) {
    let didForm = await userHelpers.checkingForm(req.session.name)
    if (didForm) {
      let formDid = false
      let did = await userHelpers.checkingTurn(req.session.name)
      if (did) formDid = true
      userHelpers.findSubject(req.session.name).then(async(subject) => {
        let turn = await userHelpers.findTurn(req.session.name)
        res.render('user/index', { user: req.session.user, loginErr: req.session.loginErr, title: req.body.formRadio, subject, formDid, turn });
      })
    }
    else res.redirect('/form')
  } else {
    res.redirect('/login')
  }

  function keepAlive() {
    console.log("Node.js is active!");
  }

  const interval = setInterval(keepAlive, 4 * 60 * 1000);

});

router.get('/login', (req, res) => {
  if (req.session.user) {
    res.redirect('/')
  }
  else {
    res.render('user/login', { loginErr: req.session.loginErr, profile: true })
    req.session.loginErr = false
  }
})

router.post('/login', (req, res) => {
  userHelpers.doLogin(req.body).then(async (response) => {
    if (response.status) {
      req.session.user = response.user
      req.session.name = response.user.Name
      req.session.user.loggedIn = true
      let didForm = await userHelpers.checkingForm(req.session.name)
      if (didForm) res.redirect('/toss')
      else res.redirect('/form')
    } else {
      req.session.loginErr = "Invalid email or password"
      res.redirect('/login')
    }
  })
})

router.get('/logout', verifyLogin, (req, res) => {
  req.session.user = null
  res.redirect('/')
})

router.get('/signup', (req, res) => {
  if (req.session.user) {
    res.redirect('/')
  }
  else {
    res.render('user/signup', { loginErr: req.session.loginErr, profile: true })
    req.session.loginErr = false
  }
})

router.post('/signup', (req, res) => {
  userHelpers.doSignup(req.body).then((response) => {
    if (response.status) {
      req.session.user = response.user
      req.session.name = response.user.Name
      req.session.user.loggedIn = true
      res.redirect('/')
    } else {
      req.session.loginErr = "this email has already taken"
      res.redirect('/signup')
    }
  })
})

router.get('/form', verifyLogin, async (req, res) => {
  let data = await userHelpers.unlockedItems()
  let unlock = {}
  for (i = 1; i <= 30; i++) {
    if (data['sum' + i] == "formRadio1") unlock.s1 = 'true'
    else if (data['sum' + i] == "formRadio2") unlock.s2 = 'true'
    else if (data['sum' + i] == "formRadio3") unlock.s3 = 'true'
    else if (data['sum' + i] == "formRadio4") unlock.s4 = 'true'
    else if (data['sum' + i] == "formRadio5") unlock.s5 = 'true'
    else if (data['sum' + i] == "formRadio6") unlock.s6 = 'true'
    else if (data['sum' + i] == "formRadio7") unlock.s7 = 'true'
    else if (data['sum' + i] == "formRadio8") unlock.s8 = 'true'
    else if (data['sum' + i] == "formRadio9") unlock.s9 = 'true'
    else if (data['sum' + i] == "formRadio10") unlock.s10 = 'true'
    else if (data['sum' + i] == "formRadio11") unlock.s11 = 'true'
    else if (data['sum' + i] == "formRadio12") unlock.s12 = 'true'
    else if (data['sum' + i] == "formRadio13") unlock.s13 = 'true'
    else if (data['sum' + i] == "formRadio14") unlock.s14 = 'true'
    else if (data['sum' + i] == "formRadio15") unlock.s15 = 'true'
    else if (data['sum' + i] == "formRadio16") unlock.s16 = 'true'
    else if (data['sum' + i] == "formRadio17") unlock.s17 = 'true'
    else if (data['sum' + i] == "formRadio18") unlock.s18 = 'true'
    else if (data['sum' + i] == "formRadio19") unlock.s19 = 'true'
    else if (data['sum' + i] == "formRadio20") unlock.s20 = 'true'
    else if (data['sum' + i] == "formRadio21") unlock.s21 = 'true'
    else if (data['sum' + i] == "formRadio22") unlock.s22 = 'true'
    else if (data['sum' + i] == "formRadio23") unlock.s23 = 'true'
    else if (data['sum' + i] == "formRadio24") unlock.s24 = 'true'
    else if (data['sum' + i] == "formRadio25") unlock.s25 = 'true'
    else if (data['sum' + i] == "formRadio26") unlock.s26 = 'true'
    else if (data['sum' + i] == "formRadio27") unlock.s27 = 'true'
    else if (data['sum' + i] == "formRadio28") unlock.s28 = 'true'
    else if (data['sum' + i] == "formRadio29") unlock.s29 = 'true'
    else if (data['sum' + i] == "formRadio30") unlock.s30 = 'true'
  }
  res.render('user/form', { user: req.session.user, loginErr: req.session.loginErr, unlock })
})

router.get('/toss', verifyLogin, async (req, res) => {
  let did = await userHelpers.checkingTurn(req.session.name)
  if (did) res.redirect('/')
  else {
    let didForm = await userHelpers.checkingForm(req.session.name)
    if (didForm) {
      let data = await userHelpers.unlockedTurns()
      let unlock = {}
      for (i = 1; i <= 30; i++) {
        if (data['sum' + i] == "6") unlock.s1 = 'true'
        else if (data['sum' + i] == "25") unlock.s2 = 'true'
        else if (data['sum' + i] == "17") unlock.s3 = 'true'
        else if (data['sum' + i] == "2") unlock.s4 = 'true'
        else if (data['sum' + i] == "26") unlock.s5 = 'true'
        else if (data['sum' + i] == "24") unlock.s6 = 'true'
        else if (data['sum' + i] == "4") unlock.s7 = 'true'
        else if (data['sum' + i] == "23") unlock.s8 = 'true'
        else if (data['sum' + i] == "13") unlock.s9 = 'true'
        else if (data['sum' + i] == "18") unlock.s10 = 'true'
        else if (data['sum' + i] == "22") unlock.s11 = 'true'
        else if (data['sum' + i] == "10") unlock.s12 = 'true'
        else if (data['sum' + i] == "21") unlock.s13 = 'true'
        else if (data['sum' + i] == "3") unlock.s14 = 'true'
        else if (data['sum' + i] == "9") unlock.s15 = 'true'
        else if (data['sum' + i] == "14") unlock.s16 = 'true'
        else if (data['sum' + i] == "16") unlock.s17 = 'true'
        else if (data['sum' + i] == "20") unlock.s18 = 'true'
        else if (data['sum' + i] == "11") unlock.s19 = 'true'
        else if (data['sum' + i] == "27") unlock.s20 = 'true'
        else if (data['sum' + i] == "29") unlock.s21 = 'true'
        else if (data['sum' + i] == "30") unlock.s22 = 'true'
        else if (data['sum' + i] == "8") unlock.s23 = 'true'
        else if (data['sum' + i] == "5") unlock.s24 = 'true'
        else if (data['sum' + i] == "28") unlock.s25 = 'true'
        else if (data['sum' + i] == "19") unlock.s26 = 'true'
        else if (data['sum' + i] == "12") unlock.s27 = 'true'
        else if (data['sum' + i] == "15") unlock.s28 = 'true'
        else if (data['sum' + i] == "1") unlock.s29 = 'true'
        else if (data['sum' + i] == "7") unlock.s30 = 'true'
      }
      res.render('user/toss', { user: req.session.user, loginErr: req.session.loginErr, unlock })
    } else res.redirect('/form')
  }
})

router.post('/toss', (req, res) => {
  console.log(req.body);
  userHelpers.turnTransfer(req.body).then((response) => {
    if (response.result) {
      res.redirect('/')
    } else if (response.sub) {
      req.session.loginErr = response.sub
      res.redirect('/toss')
      req.session.loginErr = false
    }
  })
})

router.get('/candidates', verifyLogin, async (req, res) => {
  let did = await userHelpers.checkingTurn(req.session.name)
  if (did) {
    let candidates = await userHelpers.candidates()
    res.render('user/candidates', { user: req.session.user, candidates })
  } else res.redirect('/toss')
})

router.post('/form', (req, res) => {
  let userId = userHelpers.getUserId()
  userHelpers.formTransfer(req.body).then(async (response) => {
    if (response.result) {
      res.redirect('/')
    } else if (response.exist) {
      req.session.loginErr = response.exist
      res.redirect('/')
      req.session.err = false
    } else if (response.sub) {
      req.session.loginErr = response.sub
      res.redirect('/form')
      req.session.loginErr = false
    }
  })
})

router.get('/profile', verifyLogin, async (req, res) => {
  let userProfile = await userHelpers.getUserProfile(req.session.name)
  res.render('user/profile', { user: req.session.user, profile: true, userProfile })
})

module.exports = router;
