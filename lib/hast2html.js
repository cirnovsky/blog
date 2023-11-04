// ⚠: This module is deprecated.
export default function fuckUnified(node) {
    if (node.type == 'tag') {
        const props = node.attrs || {};
        const caonima = Object.keys(props).map(
            key => `${key}="${props[key]}"`
        ).join(' ');
        const children = (node.children || {}).map(fuckUnified).join('');
        const addition = node.name == "img" ? 
            ' loading="lazy" decoding="async" data-nimg="1"'
            : '';
        const style = node.name == "img" ?
            (props.alt != undefined && props.alt.endsWith(' il') ? " class='inline-image'" : " class='post-image'")
            : '';
        const result = `<${node.name} ${caonima}${addition}${style}>${children}</${node.name}>`
        return result;
    } else if (node.type == 'text') return node.content;
    return '';
}