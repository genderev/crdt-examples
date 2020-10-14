/**
 * from https://github.com/dmitry-blackwave/LWW-Element-Set/blob/master/src/index.js
 * Simple struct for storage and easy validation for both variables
 */
export class LWWStruct {
    constructor(element, timestamp) {
        this._element = element;
        this._timestamp = timestamp;
    }

    /**
     * Returns element as string
     *
     * @return {string}
     */
    getElement() {
        return this._element;
    }

    /**
     * Validates current element and param
     *
     * @param {string} element
     * @return {boolean}
     */
    isEqual(element) {
        return this._element === element;
    }

    /**
     * Checks is current timestamp older then param
     *
     * @param {number} timestamp
     * @return {boolean}
     */
    isNewer(timestamp) {
        return this._timestamp <= timestamp;
    }
}

/**
 * Simple implementation of LWW-Element-Set CRDT
 *
 * Solution attaches timestamp to each element instead of attaching to whole set.
 * It based on: https://github.com/pfrazee/crdt_notes#lww-element-set
 */
export default class LWWElementSet {
    constructor() {
        /**
         * List of LWWStruct instances for adding
         * @type {LWWStruct[]}
         */
        this.addSet = [];

        /**
         * List of LWWStruct instances for removing
         * @type {LWWStruct[]}
         */
        this.removeSet = [];
    }

    /**
     * Adds an element to this.addSet with timestamp as LWWStruct instance
     *
     * @param {string} element
     * @param {number} timestamp
     */
    add(element, timestamp) {
        let elementIndex = this.addSet.findIndex(item => item.isEqual(element));
        if (elementIndex < 0) {
            this.addSet.push(new LWWStruct(element, timestamp));
            return;
        }

        if (this.addSet[elementIndex].isNewer(timestamp)) {
            this.addSet[elementIndex] = new LWWStruct(element, timestamp);
        }
    }

    /**
     * Adds an element to this.removeSet with timestamp as LWWStruct instance
     *
     * @param {string} element
     * @param {number} timestamp
     */
    remove(element, timestamp) {
        let elementIndex = this.removeSet.findIndex(item => item.isEqual(element));
        if (elementIndex < 0) {
            this.removeSet.push(new LWWStruct(element, timestamp));
            return;
        }

        if (this.removeSet[elementIndex].isNewer(timestamp)) {
            this.removeSet[elementIndex] = new LWWStruct(element, timestamp);
        }
    }

    /**
     * Returns list of stored data after filter by removed elements
     *
     * @returns {Array}
     */
    list() {
        let result = [];
        this.addSet.map((item) => {
            if (!this.removeSet.find(i => i.isEqual(item.getElement()))) {
                result.push(item);
            }
        });

        return result;
    }
}
