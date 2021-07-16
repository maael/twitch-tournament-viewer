/* eslint-disable */

module.exports = {
  rewrites() {
    return process.env.NODE_ENV === 'production'
      ? []
      : [
          {
            source: '/config.html',
            destination: '/config',
          },
          {
            source: '/panel.html',
            destination: '/panel',
          },
          {
            source: '/video_component.html',
            destination: '/video_component',
          },
        ]
  },
}
