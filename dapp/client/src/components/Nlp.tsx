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