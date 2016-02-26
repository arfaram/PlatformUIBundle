/*
 * Copyright (C) eZ Systems AS. All rights reserved.
 * For full copyright and license information view LICENSE file distributed with this source code.
 */
YUI.add('ez-usermenuitemfireeventview-tests', function (Y) {
    var renderTest, eventTest;

    renderTest = new Y.Test.Case({
        name: "eZ User Menu Item Fire Event render test",

        setUp: function () {
            this.title = "Welcome to the jungle";
            this.view = new Y.eZ.UserMenuItemFireEventView({
                container: '.container',
                title: this.title
            });
        },

        tearDown: function () {
            this.view.destroy();
        },

        "Should use a template": function () {
            var templateCalled = false,
                origTpl;

            origTpl = this.view.template;
            this.view.template = function () {
                templateCalled = true;
                return origTpl.apply(this, arguments);
            };

            this.view.render();
            Y.Assert.isTrue(templateCalled, "The template should have used to render the view");
        },

        "Test available variables in the template": function () {
            var origTpl = this.view.template,
                that = this;

            this.view.template = function (variables) {
                Y.Assert.isObject(variables, "The template should receive some variables");
                Y.Assert.areEqual(1, Y.Object.keys(variables).length, "The template should receive 1 variable");
                Y.Assert.areSame(
                    that.title, variables.title,
                    "The title should be available in the template"
                );
                return origTpl.apply(this, arguments);
            };
            this.view.render();
        },
    });

    eventTest = new Y.Test.Case({
        name: "eZ User Menu Item Fire Event test",

        setUp: function () {
            this.view = new Y.eZ.UserMenuItemFireEventView({
                container: '.container',
                eventName: 'logOut'
            });
        },

        tearDown: function () {
            this.view.destroy();
        },

        "Should fire the configured event": function () {
            var container = this.view.render().get('container'),
                that = this;

            this.view.on('logOut', function (e) {
                that.resume(function () {
                    Y.Assert.areEqual(
                        'tap', e.originalEvent.type,
                        "The original DOM event should be provided in the logOut event facade"
                    );
                    Y.Assert.isTrue(
                        !!e.originalEvent.prevented,
                        "The tap event should have been prevented"
                    );
                });
            });
            container.simulateGesture('tap');
            this.wait();
        },
    });

    Y.Test.Runner.setName("eZ User Menu Item Fire Event View tests");
    Y.Test.Runner.add(renderTest);
    Y.Test.Runner.add(eventTest);
}, '', {requires: ['test', 'node-event-simulate', 'ez-usermenuitemfireeventview']});
