'use strict';

/**
 * @ngdoc function
 * @name regexGeneratorApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the regexGeneratorApp
 */
angular.module('regexGeneratorApp')
  .controller('MainCtrl', ['$scope', function ($scope) {

    var characterOptions = [
      'a letter', //0 - simple
      'a lowercase letter', //1 - simple
      'an uppercase letter',//2 - simple
      'a digit',//3 - simple
      'a special character',//4 - simple
      'the following sequence',//5 - sequence
      'one of the following'//6 - one of
    ];

    var SIMPLE_STRING = 'simple';
    var SEQUENCE_STRING = 'sequence';
    var ONE_OF_STRING = 'one of';


    var typeMap = {}; // or var map = {};
    typeMap[characterOptions[0]] = SIMPLE_STRING;
    typeMap[characterOptions[1]] = SIMPLE_STRING;
    typeMap[characterOptions[2]] = SIMPLE_STRING;
    typeMap[characterOptions[3]] = SIMPLE_STRING;
    typeMap[characterOptions[4]] = SIMPLE_STRING;
    typeMap[characterOptions[5]] = SEQUENCE_STRING;
    typeMap[characterOptions[6]] = ONE_OF_STRING;

    var regexMap = {};
    regexMap[characterOptions[0]] = '?=.*[a-zA-Z]'; //a letter
    regexMap[characterOptions[1]] = '?=.*[a-z]'; //a lower-case letter
    regexMap[characterOptions[2]] = '?=.*[A-Z]'; //an upper-case letter
    regexMap[characterOptions[3]] = '?=(.*[\\d])'; //a digit
    regexMap[characterOptions[4]] = '?=(.*[\\W])'; //a special character
    regexMap[characterOptions[5]] = '(?=.*' + SEQUENCE_STRING + ')'; //sequence
    regexMap[characterOptions[6]] = '(?=.*[' + SEQUENCE_STRING + '])'; //sequence



    function getExp(k) {
      return regexMap[k];
    }

    function getType(k) {
      return typeMap[k];
    }

    function RegexRequirement() {
      var requirement = {'value': characterOptions[0], 'repeat': 1, 'type': getType(characterOptions[0]), 'sequence': undefined };
      return requirement;
    }

    $scope.regexForm = {
      characterOptions: characterOptions,

      regexRequirements: [],

      addRequirement: function() {
        $scope.regexForm.regexRequirements.push(new RegexRequirement());
      },

      removeRequirement: function(requirement) {
        var index = $scope.regexForm.regexRequirements.indexOf(requirement);
        if (index > -1) {
          $scope.regexForm.regexRequirements.splice(index, 1);
        }
      },

      hasInput: function(mapKey) {
        return getType(mapKey) === SEQUENCE_STRING || getType(mapKey) === ONE_OF_STRING;
      },

      calculateRegex: function() {
        var regex = '';
        var requirements = $scope.regexForm.regexRequirements;
        for (var i = 0, len = requirements.length; i < len; i++) {
          if (requirements[i].repeat === 0) {
            continue;
          }
          var exp = getExp(requirements[i].value);
          if (exp !== undefined) {
            if (getType(requirements[i].value) === SEQUENCE_STRING || getType(requirements[i].value) === ONE_OF_STRING) {
              exp = exp.replace(SEQUENCE_STRING, requirements[i].sequence);
            }
            regex += '(' + exp;
            if (requirements[i].repeat !== 1) {
              regex += '{' + requirements[i].repeat + ',}';
            }
            regex += ')';
          }
        }
        $scope.regexForm.regex = regex;
        $scope.regexForm.testString = '';
      },

      testString: '',

      regex: '',

      isMatch: false

    };


    $scope.regexForm.regexRequirements.push(new RegexRequirement());
    $scope.$watch('regexForm.testString', function (newTest, oldTest) {
      if (newTest !== oldTest) {
        var regex = new RegExp($scope.regexForm.regex);
        if (regex.test(newTest)) {
          $scope.regexForm.isMatch = true;
        } else {
          $scope.regexForm.isMatch = false;
        }
      }
    });


  }]);
