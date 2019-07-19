const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const dao = require('../dao/AccountDao');

const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const constant_helper = require('../utils/constant_helper')