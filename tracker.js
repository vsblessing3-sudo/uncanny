/**
 * Uncanny Test Program - Universal Tracker & State Management
 * Handles candidate intake, score tracking (Anomalies Found vs Missed),
 * evaluation criteria, and certificate population.
 */

const UncannyTracker = (function () {
    const STORAGE_KEY_USER = 'uncanny_candidate_name';
    const STORAGE_KEY_STATE = 'uncanny_test_data';
    const STORAGE_KEY_TEST_ID = 'uncanny_test_id';
    const STORAGE_KEY_DATE = 'uncanny_test_date';

    // Ground truth for the 15 cases based on the original case file comments:
    // Pages where [ANOMALY] was marked <!-- True -->: 3, 5, 7, 11, 12, 13, 15 (7 total anomalies)
    // Pages where [NORMAL] was marked <!-- True -->: 1, 2, 4, 6, 8, 9, 10, 14 (8 total normal)
    const ANSWER_KEY = {
        1:  { correct: 'NORMAL',  isAnomaly: false },
        2:  { correct: 'NORMAL',  isAnomaly: false },
        3:  { correct: 'ANOMALY', isAnomaly: true  },
        4:  { correct: 'NORMAL',  isAnomaly: false },
        5:  { correct: 'ANOMALY', isAnomaly: true  },
        6:  { correct: 'NORMAL',  isAnomaly: false },
        7:  { correct: 'ANOMALY', isAnomaly: true  },
        8:  { correct: 'NORMAL',  isAnomaly: false },
        9:  { correct: 'NORMAL',  isAnomaly: false },
        10: { correct: 'NORMAL',  isAnomaly: false },
        11: { correct: 'ANOMALY', isAnomaly: true  },
        12: { correct: 'ANOMALY', isAnomaly: true  },
        13: { correct: 'ANOMALY', isAnomaly: true  },
        14: { correct: 'NORMAL',  isAnomaly: false },
        15: { correct: 'ANOMALY', isAnomaly: true  }
    };

    const TOTAL_ANOMALIES = 7;
    const TOTAL_NORMAL = 8;
    const TOTAL_CASES = 15;

    function getStorage() {
        try {
            return window.localStorage || window.sessionStorage;
        } catch (e) {
            return null;
        }
    }

    function getState() {
        const storage = getStorage();
        if (storage) {
            const raw = storage.getItem(STORAGE_KEY_STATE);
            if (raw) {
                try {
                    return JSON.parse(raw);
                } catch (e) {}
            }
        }
        return {
            answers: {},
            anomaliesFound: 0,
            anomaliesMissed: 0,
            falseAlarms: 0,
            correctNormal: 0,
            totalAnswered: 0
        };
    }

    function saveState(state) {
        const storage = getStorage();
        if (storage) {
            storage.setItem(STORAGE_KEY_STATE, JSON.stringify(state));
        }
    }

    function generateTestId() {
        // Generates a random 7-character ID starting with 67 (e.g. 67-A94F or 6784920)
        const chars = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
        let suffix = '';
        for (let i = 0; i < 5; i++) {
            suffix += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return '67' + suffix;
    }

    return {
        TOTAL_ANOMALIES,
        TOTAL_NORMAL,
        TOTAL_CASES,

        /**
         * Initialize user session with candidate name
         */
        initUser: function (name) {
            const trimmed = (name || '').trim();
            const storage = getStorage();
            if (storage && trimmed) {
                storage.setItem(STORAGE_KEY_USER, trimmed);
                if (!storage.getItem(STORAGE_KEY_TEST_ID)) {
                    storage.setItem(STORAGE_KEY_TEST_ID, generateTestId());
                }
                storage.setItem(STORAGE_KEY_DATE, new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }));
            }
            // Reset test state for a fresh test run
            this.resetTest();
        },

        /**
         * Get the current user name (fallback to URL param, localStorage, or default)
         */
        getUserName: function () {
            try {
                const params = new URLSearchParams(window.location.search);
                const fromUrl = params.get('name');
                if (fromUrl && fromUrl.trim()) {
                    const storage = getStorage();
                    if (storage) storage.setItem(STORAGE_KEY_USER, fromUrl.trim());
                    return fromUrl.trim();
                }
            } catch (e) {}

            const storage = getStorage();
            if (storage) {
                const saved = storage.getItem(STORAGE_KEY_USER);
                if (saved && saved.trim()) return saved.trim();
            }
            return 'SUBJECT #606';
        },

        /**
         * Set user name explicitly
         */
        setUserName: function (name) {
            const storage = getStorage();
            if (storage) {
                storage.setItem(STORAGE_KEY_USER, (name || '').trim());
            }
        },

        /**
         * Record user's classification for a specific case page
         * @param {number} pageNum - 1 to 15
         * @param {string} choice - 'ANOMALY' or 'NORMAL'
         * @param {string} targetUrl - Next URL to navigate to
         */
        recordChoice: function (pageNum, choice, targetUrl) {
            const state = getState();
            const keyInfo = ANSWER_KEY[pageNum];
            const upperChoice = (choice || '').toUpperCase();

            state.answers[pageNum] = upperChoice;

            // Recalculate all scores
            let found = 0;
            let missed = 0;
            let falseAlarms = 0;
            let correctNormals = 0;
            let total = 0;

            for (let i = 1; i <= TOTAL_CASES; i++) {
                const userAns = state.answers[i];
                if (!userAns) continue;
                total++;
                const caseKey = ANSWER_KEY[i];
                if (caseKey.isAnomaly) {
                    if (userAns === 'ANOMALY') {
                        found++;
                    } else {
                        missed++;
                    }
                } else {
                    if (userAns === 'ANOMALY') {
                        falseAlarms++;
                    } else {
                        correctNormals++;
                    }
                }
            }

            state.anomaliesFound = found;
            state.anomaliesMissed = missed;
            state.falseAlarms = falseAlarms;
            state.correctNormal = correctNormals;
            state.totalAnswered = total;

            saveState(state);

            if (targetUrl) {
                window.location.href = targetUrl;
            }
        },

        /**
         * Retrieve comprehensive evaluation metrics
         */
        getResults: function () {
            const state = getState();
            const storage = getStorage();

            let testId = storage ? storage.getItem(STORAGE_KEY_TEST_ID) : null;
            if (!testId) {
                testId = generateTestId();
                if (storage) storage.setItem(STORAGE_KEY_TEST_ID, testId);
            }

            let testDate = storage ? storage.getItem(STORAGE_KEY_DATE) : null;
            if (!testDate) {
                testDate = new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                if (storage) storage.setItem(STORAGE_KEY_DATE, testDate);
            }

            const found = state.anomaliesFound || 0;
            const missed = state.anomaliesMissed || 0;
            const falseAlarms = state.falseAlarms || 0;
            const correctNormal = state.correctNormal || 0;
            const totalScore = found + correctNormal;

            // Evaluation Criteria:
            // "criteria for pass final classification: all anomalies found, no mistakes or else fail"
            const passed = (found === TOTAL_ANOMALIES && missed === 0 && falseAlarms === 0);

            let classification = '';
            if (passed) {
                classification = 'LEVEL 5 CLEARANCE — CERTIFIED ANOMALY DETECTOR';
            } else if (found >= 5 && falseAlarms <= 2) {
                classification = 'LEVEL 2 CLEARANCE — QUALIFIED OBSERVER';
            } else if (found >= 3) {
                classification = 'UNVERIFIED — SUBJECT UNDER COGNITIVE SURVEILLANCE';
            } else {
                classification = 'CRITICAL FAILURE — PERCEPTUALLY COMPROMISED';
            }

            return {
                userName: this.getUserName(),
                testId: testId,
                testDate: testDate,
                anomaliesFound: found,
                anomaliesMissed: missed,
                falseAlarms: falseAlarms,
                totalAnomalies: TOTAL_ANOMALIES,
                totalNormal: TOTAL_NORMAL,
                totalCases: TOTAL_CASES,
                totalCorrect: totalScore,
                status: passed ? 'PASS' : 'FAIL',
                isPassed: passed,
                classification: classification
            };
        },

        /**
         * Reset test progress
         */
        resetTest: function () {
            const storage = getStorage();
            if (storage) {
                storage.removeItem(STORAGE_KEY_STATE);
                storage.setItem(STORAGE_KEY_TEST_ID, generateTestId());
                storage.setItem(STORAGE_KEY_DATE, new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }));
            }
        },

        /**
         * Full reset including user name
         */
        fullReset: function () {
            const storage = getStorage();
            if (storage) {
                storage.removeItem(STORAGE_KEY_USER);
                storage.removeItem(STORAGE_KEY_STATE);
                storage.removeItem(STORAGE_KEY_TEST_ID);
                storage.removeItem(STORAGE_KEY_DATE);
            }
        }
    };
})();

if (typeof window !== 'undefined') {
    window.UncannyTracker = UncannyTracker;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UncannyTracker;
}

