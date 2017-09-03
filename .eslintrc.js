module.exports = {
    "root": true,
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "parser": "babel-eslint",
    "parserOptions": {
        "sourceType": "module"
    },
    "rules": {
        // 换行风格
        "linebreak-style": ["error", "unix"],
        // 允许使用箭头函数
        'arrow-parens': "off",
        // 允许使用 async-await
        'generator-star-spacing': "off",
        // 允许在开发环境下使用 debugger
        'no-debugger': process.env.NODE_ENV === 'production' ? "error" : "off",
        // 分号结尾
        "semi": ["error", "always"],
        // 引号类型
        "quotes": ["warn", "single"],
        // 强制使用一致的缩进 第二个参数为 "tab" 时，会使用tab，
        // if while function 后面的{必须与if在同一行，java风格。
        "brace-style": ["error", "1tbs", { "allowSingleLine": true }],
        // 不允许空格和 tab 混合缩进
        "no-mixed-spaces-and-tabs": "error",
        // 不使用tab
        "no-tabs": "error",
        // 缩进风格
        "indent": ["error", 4],
        // 确保对象中键值对间空格
        "key-spacing": ["error", {
            "beforeColon": false,
            "afterColon": true
        }],
        // 确保逗号前后空格
        "comma-spacing": ["error", {
            "before": false,
            "after": true
        }],
        // 使用严格模式
        "strict": ["error", "global"],
        // 操作符前后空格
        "space-infix-ops": "error",
        // 块前空格
        "space-before-blocks": ["error", "always"]
    }
};