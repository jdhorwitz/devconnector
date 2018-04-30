const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const validateProfileInput = require('../../validation/profile');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route  GET api/profile/
// @desc   Get Current user
// @access Private
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          errors.noprofile = 'There is no profile for this user';
          return res.status(400).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(400).json(err));
  },
);

// @route  GET api/profile
// @desc   Create or edit user profile
// @access Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);

    if (!isValid) {
      res.status(400).json(errors);
    }
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (typeof req.body.skills !== 'undefined') {
      profileFields.skills = req.body.skills.split(',');
    }

    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;
  },
);

module.exports = router;
