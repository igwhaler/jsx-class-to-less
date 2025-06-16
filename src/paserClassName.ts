import * as vscode from 'vscode';
import * as swc from '@swc/core';
import { generateLessTree } from './lessTree';

interface InterfaceUserConfig {
  cssFlavor: string;
}

const isJSXElement = (type: string | null) => type === 'JSXElement';

const getClassList = (jsxElement: any, classList = [] as any) => {
   /*  const classList = [
        {
            value: [],
            children: [
                {
                    value: [],
                    children: [],
                }
            ]
        }
    ]; */

    const selfClass = {
        value: [],
        children: [],
    };

    if (isJSXElement(jsxElement?.type)) {

        const attributes = jsxElement?.opening?.attributes || [];
        attributes.forEach((attr: any) => {
            const name = attr?.name?.value;
            const { type } = attr?.value || {};

            if (name === 'className') {
                // className="show hide save"
                if (type === 'StringLiteral') {
                    const selfValue =  attr?.value?.value?.trim();

                    if (selfValue) {
                        selfClass.value = selfClass.value.concat(selfValue.split(" "));
                    }
                }

                // className={css.show}、className={css['abc']}
                if (type === 'JSXExpressionContainer') {
                    let selfValue;
                    const expression = attr?.value?.expression;

                    if (expression?.type === 'MemberExpression') {
                        const property = expression?.property;

                        // className={css.show}
                        if (property?.type === 'Identifier') {
                            selfValue = property?.value as never;
                        }

                        // className={css['abc']}
                        if (property?.type === 'Computed') {
                            selfValue = property?.expression?.value as never;
                        }
                    }

                    if (selfValue) {
                        selfClass.value.push(selfValue);
                    }
                }
            }
        });

        const children = jsxElement.children || [];
        children?.forEach((ele: any) => {
            getClassList(ele, selfClass.children);
        });

        classList.push(selfClass);
    }

    return classList;
};

export const paserClassName = (code: string) => {
    return swc.parse(code, {
        syntax: 'ecmascript',
        jsx: true,
        decorators: false,
        importAssertions: false
    }).then(async (module: any) => {
        const rootElement = module.body[0]?.expression;
        const classList = getClassList(rootElement);

        const lessTree = generateLessTree(classList);

        return lessTree;
    });
};
