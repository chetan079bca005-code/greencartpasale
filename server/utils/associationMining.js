/**
 * Association Rule Mining - Apriori Algorithm Implementation
 * 
 * This module implements the Apriori algorithm to discover frequent itemsets 
 * and generate association rules from transaction data.
 * 
 * In an e-commerce context, this is used to find products that are 
 * "Frequently Bought Together".
 */

class Apriori {
    constructor(minSupport = 0.1, minConfidence = 0.5) {
        this.minSupport = minSupport;
        this.minConfidence = minConfidence;
    }

    /**
     * Finds frequent itemsets and generates association rules.
     * @param {Array<Array<string>>} transactions - List of transactions, where each transaction is a list of product IDs.
     * @returns {Object} { frequentItemsets, associationRules }
     */
    run(transactions) {
        const itemcounts = this.getCountIndividualItems(transactions);
        const n = transactions.length;

        // 1-itemsets
        let frequentItemsets = this.filterFrequent(itemcounts, n);
        let allFrequentSets = [...frequentItemsets.map(item => ({ items: [item], support: itemcounts[item] / n }))];

        let k = 2;
        let currentFrequentSets = frequentItemsets.map(item => [item]);

        while (currentFrequentSets.length > 0) {
            const candidates = this.generateCandidates(currentFrequentSets, k);
            const candidateCounts = this.countCandidates(transactions, candidates);
            const frequentCandidates = candidates.filter(c => (candidateCounts[c.join(',')] / n) >= this.minSupport);

            if (frequentCandidates.length === 0) break;

            allFrequentSets.push(...frequentCandidates.map(c => ({
                items: c,
                support: candidateCounts[c.join(',')] / n
            })));

            currentFrequentSets = frequentCandidates;
            k++;
        }

        const associationRules = this.generateRules(allFrequentSets);
        return { frequentItemsets: allFrequentSets, associationRules };
    }

    getCountIndividualItems(transactions) {
        const counts = {};
        transactions.forEach(transaction => {
            transaction.forEach(item => {
                counts[item] = (counts[item] || 0) + 1;
            });
        });
        return counts;
    }

    filterFrequent(counts, n) {
        return Object.keys(counts).filter(item => (counts[item] / n) >= this.minSupport);
    }

    generateCandidates(frequentSets, k) {
        const candidates = [];
        for (let i = 0; i < frequentSets.length; i++) {
            for (let j = i + 1; j < frequentSets.length; j++) {
                const combined = Array.from(new Set([...frequentSets[i], ...frequentSets[j]])).sort();
                if (combined.length === k) {
                    if (!candidates.some(c => c.join(',') === combined.join(','))) {
                        candidates.push(combined);
                    }
                }
            }
        }
        return candidates;
    }

    countCandidates(transactions, candidates) {
        const counts = {};
        transactions.forEach(transaction => {
            const transactionSet = new Set(transaction);
            candidates.forEach(candidate => {
                if (candidate.every(item => transactionSet.has(item))) {
                    const key = candidate.join(',');
                    counts[key] = (counts[key] || 0) + 1;
                }
            });
        });
        return counts;
    }

    generateRules(frequentSets) {
        const rules = [];
        const setMap = {};
        frequentSets.forEach(fs => setMap[fs.items.sort().join(',')] = fs.support);

        frequentSets.forEach(fs => {
            if (fs.items.length > 1) {
                // For simplified itemsets of size 2 (common in ecommerce)
                // If [A, B] is frequent, check rule A -> B
                const combinations = this.getPowerSet(fs.items).filter(x => x.length > 0 && x.length < fs.items.length);

                combinations.forEach(antecedent => {
                    const consequent = fs.items.filter(x => !antecedent.includes(x));
                    const supportAB = fs.support;
                    const supportA = setMap[antecedent.sort().join(',')];

                    if (supportA) {
                        const confidence = supportAB / supportA;
                        if (confidence >= this.minConfidence) {
                            rules.push({
                                antecedent: antecedent,
                                consequent: consequent,
                                confidence: confidence,
                                support: supportAB
                            });
                        }
                    }
                });
            }
        });
        return rules;
    }

    getPowerSet(array) {
        return array.reduce((subsets, value) => subsets.concat(subsets.map(set => [value, ...set])), [[]]);
    }
}

export default Apriori;
