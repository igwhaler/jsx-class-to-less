interface LessTreeTypes {
    value: string[];
    children: LessTreeTypes[];
}

const getSiblingClass = (list: string[], count: number) => {
    const classStr = list.map(str => {
        const tab = Array(count).fill(1).map(() => '\t').join('');

        return `${tab}&.${str} { }\n`;
    }).join('');

    return classStr;
};

export const generateLessTree = (classList: LessTreeTypes[], count = 1) => {
    const tree = classList.reduce((pre, item) => {
        const rootClass = item.value[0];
        const siblingClass = item.value.length > 1 ? getSiblingClass(item.value.slice(1), count) : '';
        const rootTab = Array(count-1).fill(1).map(() => '\t').join('');

        if (rootClass) {
            return pre +=
                `${rootTab}.${rootClass} {\n`
                + `${siblingClass}\n`
                + `${generateLessTree(item.children, count+1)}`
                + `${rootTab}}\n`
            ;
        } else { // 无className
            return pre += `${generateLessTree(item.children, count)}\n`;
        }
    }, '') as string;

    return tree;
};
