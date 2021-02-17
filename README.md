# Eventbrite Importer

## What is this?

It's a way to import data from Eventbrite into your custom website. Is it useful? It helped me out so I figured I'd make it available.

## How to use:

_Step one:_ Get your Eventbrite organization ID and an API token

_Step two:_ Setup an API end point on your project to handle the data, for example: `POST http://mysite/api/events/create`

_Step three:_ Run this bad boy like this: 

```node eventbrite.js --token=XXX --org=123 --url='http://mysite/api/events/create'```

## Arguments
- `token` or `t`: Eventbrite API Token
- `org` or `o`: Eventbrite Organization ID
- `url` or `u`: URL for your application to handle the data from Eventbrite
- `page` or `p`: Page offset in case you've already started the process and you want to continue
