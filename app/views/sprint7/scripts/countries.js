var countries = {
  type: function(country) {
    var countryType = { 'resident': false, 'insurance': false };
    var resident = countries.resident();
    var insurance = countries.insurance();

    if ( resident.indexOf(country) > -1 ) {
      countryType.resident = true;
    } else if ( insurance.indexOf(country) > -1 ){
      countryType.insurance = true;
    }

    return countryType;
  },

  resident: function() {
    var resident = [
      'Australia',
      'Canada',
      'New Zealand'
    ];
    return resident;
  },

  insurance: function() {
    var insurance = [
      'Barbados',
      'Bermuda',
      'Guernsey',
      'Israel',
      'Jamaica',
      'Jersey',
      'Mauritius',
      'Philippines',
      'Turkey',
      'United States of America',
      'Austria',
      'Belgium',
      'Bosnia and Herzegovina',
      'Croatia',
      'Cyprus',
      'Czech Republic',
      'Denmark',
      'Estonia',
      'Finland',
      'France',
      'Germany',
      'Gibraltar',
      'Greece',
      'Hungary',
      'Iceland',
      'Ireland',
      'Isle of Man',
      'Italy',
      'Latvia',
      'Liechtenstein',
      'Lithuania',
      'Luxembourg',
      'Macedonia',
      'Malta',
      'Montenegro',
      'Netherlands',
      'Norway',
      'Poland',
      'Portugal',
      'Serbia',
      'Slovakia',
      'Slovenia',
      'Spain',
      'Sweden',
      'Switzerland'
    ];

    return insurance;
  }
};
module.exports = countries;
