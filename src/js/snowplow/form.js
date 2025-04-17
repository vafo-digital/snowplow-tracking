import { trackSelfDescribingEvent } from "@snowplow/browser-tracker";

export function snowplowForm() {

    return {

        track: () => {

            trackSelfDescribingEvent({
                event: {
                    schema: 'iglu:com.poochandmutt/form_action/jsonschema/1-0-0',
                    data: {
                        type: this.state.form.event_type
                    }
                },
                context: [{
                    schema: 'iglu:com.poochandmutt/form_object/jsonschema/1-0-0',
                    data: this.state.form.event_context
                }]
            });

            this.debug('formEvent', this.state.form);

        }

    };

}