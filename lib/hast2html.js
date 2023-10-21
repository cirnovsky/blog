export default function fuckUnified(node) {
    if (node.type == 'tag') {
        const props = node.attrs || {};
        // console.log(Object.keys(props))
        // console.log(props)
        const caonima = Object.keys(props).map(
            key => `${key}="${props[key]}"`
        ).join(' ');
        const children = (node.children || {}).map(fuckUnified).join('');
        const result = `<${node.name} ${caonima}>${children}</${node.name}>`
        return result;
    } else if (node.type == 'text') return node.content;
    return '';
}