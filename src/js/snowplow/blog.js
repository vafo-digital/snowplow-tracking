import { trackSelfDescribingEvent, addGlobalContexts } from "@snowplow/browser-tracker";

export function snowplowBlog() {

    return {

        //################################//
        // || CUSTOM BLOG ACTION EVENT || //
        //################################//

        /*
        // Custom blog action 
        // Uses custom blog action schema and passes blog context.
        */

        blog: (event_type) => {

            trackSelfDescribingEvent({
                event: {
                    schema: 'iglu:com.poochandmutt/blog_action/jsonschema/1-0-1',
                    data: {
                        type: event_type
                    }
                },
                context: [this.snowplowBlog().setBlogContext()]
            });

        },

        //###################################//
        // || CUSTOM ARTICLE ACTION EVENT || //
        //###################################//

        /*
        // Custom article action (part of the blog action schema) 
        // Uses custom blog action schema and passes blog context.
        // Passes article context.
        // Passed author context.
        */

        article: (event_type, event_name) => {

            trackSelfDescribingEvent({
                event: {
                    schema: 'iglu:com.poochandmutt/blog_action/jsonschema/1-0-1',
                    data: {
                        type: event_type,
                        name: event_name
                    }
                },
                context: [
                    this.snowplowBlog().setBlogContext(),
                    this.snowplowBlog().setArticleContext(),
                    this.snowplowBlog().setAuthorContext()
                ].filter(Boolean)
            });

            if (event_type == 'article_view') {
                addGlobalContexts([
                    this.snowplowBlog().setArticleContext(),
                    this.snowplowBlog().setAuthorContext()
                ]);
            }

        },

        //###################################//
        // || CUSTOM ARTICLE ACTION EVENT || //
        //###################################//

        /*
        // Custom article action (part of the blog action schema) 
        // Uses custom blog action schema and passes blog context.
        // Passes article context.
        // Passed author context.
        */

        author: (event_type, event_name) => {

            trackSelfDescribingEvent({
                event: {
                    schema: 'iglu:com.poochandmutt/blog_action/jsonschema/1-0-1',
                    data: {
                        type: event_type,
                        name: event_name
                    }
                },
                context: [
                    this.snowplowBlog().setAuthorContext()
                ]
            });

        },

        //###########################################//
        // || SET BLOG CONTEXT WITH CUSTOM SCHEMA || //
        //###########################################//
        
        setBlogContext: () => {
                
            if (!this.state.blog) {
                return false;
            }

            return {
                schema: 'iglu:com.poochandmutt/blog_object/jsonschema/1-0-0',
                data: this.state.blog
            }

        },

        //##############################################//
        // || SET ARTICLE CONTEXT WITH CUSTOM SCHEMA || //
        //##############################################//

        setArticleContext: () => {
                
            if (!this.state.article) {
                return false;
            }

            return {
                schema: 'iglu:com.poochandmutt/article_object/jsonschema/1-0-0',
                data: this.state.article
            }

        },

        //#############################################//
        // || SET AUTHOR CONTEXT WITH CUSTOM SCHEMA || //
        //#############################################//        

        setAuthorContext: () => {
                
            if (!this.state.author) {
                return false;
            }

            return {
                schema: 'iglu:com.poochandmutt/author_object/jsonschema/1-0-0',
                data: this.state.author
            }

        }
    
    };

}