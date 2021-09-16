import React, { useContext } from 'react'
import { Container, Padding } from '../../../components/layout'
import { OwnerList } from '../../../components/owner-list'
import { HicetnuncContext } from '../../../context/HicetnuncContext'
import { OwnerSwaps } from '../../../components/owner-swaps'

const _ = require('lodash')

export const Collectors = ({ owners, swaps, token_holders, restricted }) => {
  const { syncTaquito, collect, acc, getAccount, cancel } =
    useContext(HicetnuncContext)

  // sort swaps in ascending price order

  swaps = _.orderBy(swaps, 'price', 'asc')

  const handleCollect = (swap_id, price) => {
    if (acc == null) {
      syncTaquito()
      getAccount()
    } else {
      collect(swap_id, price)
    }
  }
  return (
    <>
      {swaps.length > 0 && (
        <Container>
          <Padding>
            <OwnerSwaps
              swaps={swaps}
              handleCollect={handleCollect}
              acc={acc}
              cancel={cancel}
              restricted={restricted}
            />
          </Padding>
        </Container>
      )}

      {/* {filtered.length === 0 ? undefined : ( */}
        <Container>
          <Padding>
            <OwnerList 
              owners={token_holders} 
              acc={acc}
              swaps={swaps} 
            />
          </Padding>
        </Container>
      {/* )} */}
    </>
  )
}
