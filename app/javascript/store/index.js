import { createStore } from 'vuex';

const store = createStore({
  state: {
    linkedEntries: {}, // New
  },
  mutations: {
    SET_LINKED_ENTRIES(state, entries) {
      state.linkedEntries = entries.reduce((acc, entry) => {
        acc[entry.id] = entry;
        return acc;
      }, {});
    },
    REMOVE_ENTRY_FROM_LINKED_ENTRIES(state, id) {
      const { [id]: removed, ...remaining } = state.linkedEntries;
      state.linkedEntries = remaining;
    },
    ADD_ENTRY_TO_LINKED_ENTRIES(state, entry) {
      state.linkedEntries = {
        ...state.linkedEntries,
        [entry.id]: entry,
      };
    },
  },
  actions: {
    updateLinkedEntries({ commit }, entries) {
      commit('SET_LINKED_ENTRIES', entries);
    },
    removeEntryFromLinkedEntries({ commit }, id) {
      commit('REMOVE_ENTRY_FROM_LINKED_ENTRIES', id);
    },
    addEntryToLinkedEntries({ commit }, entry) {
      commit('ADD_ENTRY_TO_LINKED_ENTRIES', entry);
    }
  },
  getters: {
    linkedEntries: (state) => state.linkedEntries
  },
});

export default store;