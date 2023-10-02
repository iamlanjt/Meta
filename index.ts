import { writeFileSync } from "fs";

const NBSP = "‌" // Used to depict 0
const ZWSP = "​" // Used to depict 1
const ZWJ = "‍" // Zero-width joiner
const TERMINATOR = " " + ZWJ // Unique terminator to prevent overflow
const SIGNATURE = "​‍‍​​‍​​‍‍‍​‍​​‍​‍​‍‍​‍‍‍‍‍​​​​​​​‍‍​‍‍​​‍​‍​‍‍‍​‍​‍​‍​‍​‍‍‍​‍‍‍‍‍​‍​​​​​​‍ ‍" // Used as a signature on files to let the parser know that META was used for encoding // does exist

export interface MetaStructure {
	key: string | undefined;
	isEncrypted: boolean,
	contents: {}
}

function encodeString(text: string): string {
	let pointer = 0
	let endString = ''
	while (pointer < text.length) {
		const charCode = text.substring(pointer, pointer + 1).charCodeAt(0).toString(2).padStart(8, '0')
		let done = ''

		for (let i = 0; i < charCode.length; i++) {
			if (charCode[i] === '0') {
				done += NBSP
			} else {
				done += ZWSP
			}
		}

		endString += done
		
		pointer++
	}

	return SIGNATURE + endString + TERMINATOR
}

function decodeString(text: string): string {
    let pointer = 0;
    let decodedString = '';
    let binaryDigit = '';

    while (pointer < text.length) {
        if (text.substring(pointer, pointer + 1) === ZWSP) {
            binaryDigit += '1';
        } else if(text.substring(pointer, pointer + 1) === NBSP) {
            binaryDigit += '0';
        }

        if (binaryDigit.length === 8) {
            decodedString += String.fromCharCode(parseInt(binaryDigit, 2));
            binaryDigit = '';
        }

        pointer++;
    }

    return decodedString;
}

export class MetaAttachment {
	text: string

	constructor(text: string) {
		this.text = text
	}

	get isEncoded(): boolean {
		return decodeString(this.text).startsWith(decodeString(SIGNATURE))
	}

	get meta(): MetaStructure | undefined {
		if (!this.isEncoded)
			return undefined

		return {
			key: undefined,
			isEncrypted: false,
			contents: JSON.parse(decodeString(this.text.split(TERMINATOR)[1]))
		}
	}
}

const encodedMetadata = encodeString(JSON.stringify({
	version: '0.0.1',
	author: 'lanjt',
	description: 'A library to encode metadata using invisible characters.'
}))
const endString = ('const x = 1') + encodedMetadata

const Met = new MetaAttachment(endString)

console.log(`--- Expected Output: true / (OBJ) ---`)
console.log(Met.isEncoded)
console.log(Met.meta)

const NewMet = new MetaAttachment('meow')

console.log(`--- Expected Output: false / (UNDEFINED) ---`)
console.log(NewMet.isEncoded)
console.log(NewMet.meta)