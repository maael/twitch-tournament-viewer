# Tournament Viewer Twitch Extension

Show tournament information from [smash.gg](https://smash.gg) without leaving the twitch stream.

## Setting Up the extension (Developer)

### Setting up asset hosting

Go to the extension version `Asset Hosting` tab, then:

1. Change `Testing Base URI` to `http://localhost:3000` (make sure you've allowed https on local in Chrome flags)
2. Set paths, see the redirects in `next.config.js`

### Configuration capabilities

Go to the extension version `Capabilities` tab, scroll to the bottom, and tick `Extension Configuration Service`, and hit `Save Changes`.

## Twitch Releases

### Walkthrough Guide

```
Change log:
- Changes

Walkthrough Guide:

For Viewer:
1. Go to page with panel extension configured
2. See loading message and then tournament information

For broadcaster:
1. Set up extension configuration, making sure to link the correct tournament
2. Save configuration
3. Refresh page
4. View extension panel, see loading message and then tournament information
```
