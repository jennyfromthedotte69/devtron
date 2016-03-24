const Eval = require('../lib/eval')
const vm = require('vm')

const describe = global.describe
const it = global.it
const beforeEach = global.beforeEach
const afterEach = global.afterEach

describe('Eval', () => {
  beforeEach(() => {
    global.window = {
      chrome: {
        devtools: {
          inspectedWindow: {
            eval: (expression, callback) => {
              try {
                callback(vm.runInNewContext(expression))
              } catch (error) {
                callback(null, error)
              }
            }
          }
        }
      }
    }
  })

  afterEach(() => {
    delete global.window
  })

  describe('execute(expression, ...args)', () => {
    it('returns a promise that resolves to the value of the specified expression', () => {
      return Eval.execute('1+1').should.eventually.equal(2)
    })

    it('returns a rejected promise on errors', () => {
      return Eval.execute('+-').should.be.rejected
    })

    it('accepts a function with no arguments', () => {
      return Eval.execute(() => 3).should.eventually.equal(3)
    })

    it('accepts a function with arguments', () => {
      return Eval.execute((x, y) => x + y, 1, 2).should.eventually.equal(3)
    })
  })
})