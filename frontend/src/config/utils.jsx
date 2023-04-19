import { useState } from "react";

function limit(element,tamanho)
{
    let max_chars
    tamanho?max_chars = tamanho:max_chars=250;
        
    if(element.value.length > max_chars) {
        element.value = element.value.substr(0, max_chars);
    }
}
export {limit};