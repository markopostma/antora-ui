'use strict';

const graphql = require('graphql');

const HEROES = [
  { id: 1, name: 'Batman', rating: 10 },
  { id: 2, name: 'Superman', rating: 9 },
  { id: 3, name: 'Spiderman', rating: 8 },
  { id: 1337, name: 'Vegeta', rating: 9001 }
];

class GraphqlPlayground extends HTMLElement {
  static observedAttributes = ['operation'];

  static CONFIG = {
    schema: graphql.buildSchema(`
      type Hero {
        id: ID
        name: String
        rating: Int
      }

      type Query {
        heroes: [Hero]!
        hero(id: ID!): Hero
      }`),
    rootValue: {
      heroes: HEROES,
      hero: ({ id }) => HEROES.find(hero => Number(hero.id) === Number(id))
    }
  };

  /**
   *
   * @param {{ rootValue: { [name: string]: any[] }, schema: GraphQLSchema }} updateData
   */
  static configure(updateData) {
    const { rootValue, schema } = updateData;
    const data = { rootValue, schema };

    Object.assign(
      this.CONFIG,
      Object.keys(data)
        .filter(key => data[key] !== null && data[key] !== undefined)
        .reduce((prev, curr) => {
          prev[curr] = data[curr];
          return prev;
        }, {})
    );

    return this;
  }

  constructor() {
    super();

    this.textarea = this.querySelector('textarea');
    this.responseBlock = this.querySelector('pre');

    this.textarea.addEventListener('input', async ev => {
      const execution = await this.execute(ev.target.textContent);
      this.responseBlock.querySelector('code').innerText = execution;
      console.log(execution, ev.target.textContent, ev.target.innerText);
    });
  }

  /**
   *
   * @param {string} name
   * @param {string | null} oldValue
   * @param {string} newValue
   */
  async attributeChangedCallback(name, oldValue, newValue) {
    this[name] = newValue;

    console.log('attributeChangedCallback', newValue);

    if (name === 'operation' && this.textarea) {
      this.textarea.innerText = newValue;
      const execution = await this.execute(newValue);

      this.responseBlock.querySelector('code').innerText = execution;
    }
  }

  async connectedCallback() {
    console.log('CONNECTED', this);
  }

  async disconnectedCallback() {
    console.log('DISCONNECTED', this);
  }

  /**
   *
   * @param {string} source
   * @param {Object} variableValues
   * @returns {Promise<graphql.ExecutionResult>}
   */
  async execute(source, variableValues = {}) {
    const { schema, rootValue } = GraphqlPlayground.CONFIG;

    return await graphql
      .graphql({
        schema,
        source,
        rootValue,
        variableValues
      })
      .then(response => JSON.stringify(response, null, 2));
  }
}

window.customElements.define('graphql-playground', GraphqlPlayground);
