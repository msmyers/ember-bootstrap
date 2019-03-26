import { module } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import test from 'ember-sinon-qunit/test-support/test';
import setupNoDeprecations from '../../../helpers/setup-no-deprecations';
import { testBS4 } from '../../../helpers/bootstrap-test';

module('Integration | Component | bs-nav/item', function(hooks) {
  setupRenderingTest(hooks);
  setupNoDeprecations(hooks);

  hooks.beforeEach(function() {
    this.actions = {};
    this.send = (actionName, ...args) => this.actions[actionName].apply(this, args);
    this.owner.lookup('router:main').setupRouter();
  });

  test('it has correct markup', async function(assert) {
    await render(hbs`
      {{#bs-nav/item}}
        template block text
      {{/bs-nav/item}}
    `);

    assert.dom('*').hasText('template block text', 'Shows block content');
    assert.dom('li').exists({ count: 1 }, 'it is an list item');
    assert.ok(!this.element.querySelector('li').classList.contains('active'), 'has not active class');
    assert.ok(!this.element.querySelector('li').classList.contains('disabled'), 'has not disabled class');

  });

  test('can be disabled', async function(assert) {
    await render(hbs`{{bs-nav/item disabled=true}}`);

    assert.dom('li').hasClass('disabled', 'has disabled class');
  });

  test('can be active', async function(assert) {
    await render(hbs`{{bs-nav/item active=true}}`);

    assert.dom('li').hasClass('active', 'has active class');
  });

  test('simple linkTo property adds link', async function(assert) {
    await render(hbs`{{bs-nav/item linkTo="index"}}`);

    assert.dom('li a').exists({ count: 1 });
    assert.dom('li a').hasAttribute('href', '/');
  });

  test('complex linkTo property adds link', async function(assert) {
    await render(hbs`{{bs-nav/item linkTo=(array "acceptance.link" "1" (query-params foo="bar"))}}`);

    assert.dom('li a').exists({ count: 1 });
    assert.dom('li a').hasAttribute('href', '/acceptance/link/1?foo=bar');
  });

  testBS4('link has nav-link class', async function(assert) {
    await render(hbs`{{bs-nav/item linkTo="index"}}`);

    assert.dom('li a').hasClass('nav-link');
  });

  test('disabled and linkTo property adds disabled link', async function(assert) {
    await render(hbs`{{bs-nav/item linkTo="index" disabled=true}}`);

    assert.dom('li a').hasClass('disabled');
  });

  test('[DEPRECATED] active link-to makes nav item active', async function(assert) {

    await render(hbs`
      {{#bs-nav/item}}
        {{#bs-nav/link-to "application" active="foo"}}Test{{/bs-nav/link-to}}
      {{/bs-nav/item}}
    `);
    assert.dom('li').hasClass('active', 'has active class');
    assert.deprecations();
  });

  test('[DEPRECATED] disabled link makes nav item disabled', async function(assert) {

    await render(hbs`
      {{#bs-nav/item}}
        {{#bs-nav/link-to "application" disabled="foo"}}Test{{/bs-nav/link-to}}
      {{/bs-nav/item}}
    `);
    assert.dom('li').hasClass('disabled', 'has disabled class');
    assert.deprecations();
  });

  test('clicking item calls onClick action', async function(assert) {
    let action = this.spy();
    this.actions.click = action;
    await render(hbs`{{bs-nav/item onClick=(action "click")}}`);
    await click('li');

    assert.ok(action.calledOnce, 'action has been called');
  });
});
