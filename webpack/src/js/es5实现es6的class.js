const Foo = function () {
    function Foo(name) {
        _checkType(this, Foo) // 先检查是不是new调用的

        this.name = name
    }

    _createClass (Foo, [ // 表示在class内部定义的方法
        {
            key: 'say',
            value: function () {
                console.log(this.name)
            }
        }
    ], [ // 表示在class内部定义的静态方法
        {
            key: 'say',
            value: function () {
                console.log('static say')
                console.log(this.name)
            }
        }
    ])

    return Foo
}()

function _checkType (obj, constructor) {
    if (!(obj instanceof constructor)) {
        throw new TypeError('Cannot call a class as a function')
    }
}

function defineProperties (target, descriptors) {
    for (let descriptor of descriptors) {
        descriptor.enumerable = descriptor.enumerable || false

        descriptor.configurable = true
        if ('value' in descriptor) {
            descriptor.writable = true
        }

        Object.defineProperty(target, descriptor.key, descriptor)
    }
}

// 构造class
// constructor 表示类对应的constructor对象
// protoDesc 表示class内部定义的方法
// staticDesc 表示class内部定义的静态方法
function _createClass (constructor, protoDesc, staticDesc) {
    protoDesc && defineProperties(constructor.prototype, protoDesc)
    staticDesc && defineProperties(constructor, staticDesc)
    return constructor
}
