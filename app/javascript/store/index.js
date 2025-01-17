import { createStore } from 'vuex';

const store = createStore({
  state: {
    linkedEntryIds: [], // Shared state for linked entries
  },
  mutations: {
    SET_LINKED_ENTRY_IDS(state, ids) {
      state.linkedEntryIds = ids;
    },
  },
  actions: {
    updateLinkedEntryIds({ commit }, ids) {
      commit('SET_LINKED_ENTRY_IDS', ids);
    },
  },
  getters: {
    linkedEntryIds: (state) => state.linkedEntryIds,
  },
});

export default store;