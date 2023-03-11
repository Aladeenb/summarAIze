function textPrep(text: string): string {
    const par_pattern = /\([^()]*\)/g;
    const trimmedText = text.replace(par_pattern, '')
                            .replace(/\s*([.,;:!?"])/g, "$1")
                            .replace(/\n/g, " ")
                            .replace(/\n\n/g, " ")
                            .replace(/  /g, " ")
                            .replace(/"/g, "");
    return trimmedText;
}

console.log(textPrep('this is (a test)! \nthis is a return to line "". '))

import * as nlp from 'nlp_compromise';

function removeAdjectives(text: string): string {
  const taggedTokens = nlp.text(text).terms().tag();
  const filteredTokens = taggedTokens.filter(token => !token.tags.includes('Adjective'));
  const filteredText = filteredTokens.map(token => token.text).join(' ');
  return filteredText;
}