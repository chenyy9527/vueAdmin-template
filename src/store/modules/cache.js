import { allList } from '@/api/supplier'

const cache = {
  state: {
    supplierCache: new Map()
  },
  mutations: {
    SET_SUPPLIER_CACHE: (state, avatar) => {
      state.supplierCache = avatar
    }
  },
  actions: {
    GetSupplierList({ commit, state }) {
      return new Promise((resolve, reject) => {
        allList().then(response => {
          const supplierList = response.data
          const map = new Map()
          supplierList.forEach(function(val, index, arr) {
            map.set(val.supplierId, val.supplierName)
          })
          commit('SET_SUPPLIER_CACHE', map)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default cache
