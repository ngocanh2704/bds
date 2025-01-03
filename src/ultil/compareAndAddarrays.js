/**
 * Compare two arrays and add unique elements from the second array to the first array
 * @param {Array} arr1 - First array
 * @param {Array} arr2 - Second array
 * @returns {Array} - Updated first array with unique elements from the second array
 */

function compareAndAddArrays(arr1, arr2) {
    console.log(arr1, arr2);
    arr2.forEach((element) => {
        if (!arr1.some((item) => item._id === element._id)) {
            arr1.push(element);
        }
    });
    return arr1;
}

export default compareAndAddArrays;