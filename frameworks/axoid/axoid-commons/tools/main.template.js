// main registry

{%for file in files%}
// {{ file.relative }}
require('./{{ file.relative }}');
{%endfor%}
