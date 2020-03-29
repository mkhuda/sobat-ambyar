export function contains(target: string) {
    const pattern: Array<string> = ['ambyar', 'sobat ambyar', 'pantun', 'galau', 'didi kempot']
    let value = 0
    pattern.forEach((word) => {
        value = value + Number(target.includes(word));
    });
    return value >= 1;
}

export function buildTextBlocks(text: string) {
    return [
        {
            "type": "divider"
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": text
            }
        },
        {
            "type": "context",
            "elements": [
                {
                    "type": "mrkdwn",
                    "text": "For more absurd, please join *<Jogja Dirty Team>*"
                }
            ]
        }
    ]
}