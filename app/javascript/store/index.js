import { createStore } from 'vuex';

const store = createStore({
  state: {
    linkedEntryIds: [], // Shared state for linked entries
  },
  mutations: {
    SET_LINKED_ENTRY_IDS(state, ids) {
      state.linkedEntryIds = ids;
    },
    REMOVE_ID_FROM_LINKED_ENTRY_IDS(state, id) {
      state.linkedEntryIds = state.linkedEntryIds.filter(entryId => entryId !== id);
    },
    ADD_ID_TO_LINKED_ENTRY_IDS(state, id) {
      state.linkedEntryIds.push(id);
    }
  },
  actions: {
    updateLinkedEntryIds({ commit }, ids) {
      commit('SET_LINKED_ENTRY_IDS', ids);
    },
    removeIdFromLinkedEntryIds({ commit }, id) {
      commit('REMOVE_ID_FROM_LINKED_ENTRY_IDS', id);
    },
    addIdToLinkedEntryIds({ commit }, id) {
      commit('ADD_ID_TO_LINKED_ENTRY_IDS', id);
    }
  },
  getters: {
    linkedEntryIds: (state) => state.linkedEntryIds,
  },
});

export default store;