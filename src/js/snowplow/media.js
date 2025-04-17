import { enableMediaTracking } from '@snowplow/browser-plugin-media-tracking';

export function snowplowMedia() {

    return {

        init: () => {

            let id;
            let label;

            document.querySelectorAll('video[sp-track-video]').forEach((video, index) => {

                // Set ID and Label
                id = 'sp-video-' + index;
                label = video.getAttribute('sp-track-video');

                // Store ID on video element
                video.id = id;

                // Enable Media Tracking
                enableMediaTracking({
                    id: id,
                    options: {
                    label: label,
                    captureEvents: ['play', 'pause', 'ended'],
                    boundaries: [20, 80],
                    volumeChangeTrackingInterval: 200,
                    }
                });

            });

        }

    }

}