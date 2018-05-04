module.exports = {
  get_options: function(req) {
    var options = req.cookies.settings;

    if ( options === undefined ) {
      options = {};
    }

    options.nino_version    = get_nino_version(req);
    options.nino_highlight  = get_nino_highlight(req);
    options.bank_version    = get_bank_version(req);
    options.fail_feature   = get_fail_feature(req);

    return options;
  },

  get_bank_errors: function(req, options, data) {
    var errors = {},
        prefix,
        sortcode;
    errors.bank_type = req.body.building;

    if ( errors.bank_type == 'building' ) {
      prefix = 'bs';
    } else if ( errors.bank_type == 'bank' ) {
      prefix = 'ba';
    }

    if ( options.bank_version.slice(-1) == 1 ) {
      sortcode = prefix + '-sort3';
    } else if ( options.bank_version.slice(-1) == 2 ) {
      sortcode = prefix + '-sort-code';
    }

    errors.title = "There's a problem";
    errors.text = "Please check that you've entered your bank account details correctly:";

    if ( options.fail_feature == 'err_mismatch_name' ) {
      data[prefix + '-account-holder'] = data[prefix + '-account-holder'].slice(0, -1);
    } else if ( options.fail_feature == 'err_account_no') {
      data[prefix + '-account-number'] = data[prefix + '-account-number'].slice(0, -1);
    } else if ( options.fail_feature == 'err_sort') {
      data[sortcode] = data[sortcode].slice(0, -1);
    }

    return errors;
  }
};

function get_fail_feature(req) {
  var options = req.cookies.settings;
  if ( options === undefined || options.fail_feature === undefined ) {
    options = {};
    options.fail_feature = 0;
  }

  return options.fail_feature;
}

function get_nino_version(req) {
  var options = req.cookies.settings;
  if ( options === undefined ) {
    options = {};
    options.nino_version = 'january/settings/auth_1';
  } else if ( options.nino_version == 1 ) {
    options.nino_version = 'january/settings/auth_1';
  } else if ( options.nino_version == 2 ) {
    options.nino_version = 'january/settings/auth_2';
  }

  return options.nino_version;
}

function get_nino_highlight(req) {
  var options = req.cookies.settings;

  if ( options === undefined || options.nino_highlight === undefined ) {
    options = {};
    options.nino_highlight = '<p class="form-hint">For example, QQ 12 34 <span class="span_nino">5</span> <span class="span_nino">6</span>  C</p>';
  } else if ( options.nino_highlight == 1 ) {
    options.nino_highlight = '<p class="form-hint">For example, QQ 12 34 <span class="span_nino">5</span> <span class="span_nino">6</span>  C</p>';
  } else if ( options.nino_highlight == 2) {
    options.nino_highlight = '<p class="form-hint">For example, QQ 12 34 <span class="span_nino2">56</span>  C</p>';
  }

  return options.nino_highlight;
}

function get_bank_version(req) {
  var options = req.cookies.settings;

  if ( options === undefined || options.bank_version === undefined ) {
    options = {};
    options.bank_version = 'january/settings/bank_details_1';
  } else if (options.bank_version == 1) {
    options.bank_version = 'january/settings/bank_details_1';
  } else if (options.bank_version == 2) {
    options.bank_version = 'january/settings/bank_details_2';
  }

  return options.bank_version;
}
