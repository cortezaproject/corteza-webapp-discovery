// Corteza API location
window.CortezaAPI = 'http://localhost:1042/api'
window.SearcherAPI = 'http://localhost:3101/api'

// CortezaAuth can be autoconfigured by replacing /api with /auth in CortezaAPI
// or by appending /auth to the end of CortezaAPI string
// When this is not possible and your configuration is more exotic you can set it
// explicitly:
// window.CortezaAuth = 'https://api.cortezaproject.your-domain.tld/auth';

// Configure CortezaWebapp when your web applications are not placed on the root.
// This is autoconfigured from the value of <base> tag href attribute in most cases.
// window.CortezaWebapp = 'https://cortezaproject.your-domain.tld';
