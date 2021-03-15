import React, { Component } from 'react'
import { Button, Primary } from '../../components/button'
import { HicetnuncContext } from '../../context/HicetnuncContext'
import { Page, Container, Padding } from '../../components/layout'
import { Loading } from '../../components/loading'
import { renderMediaType } from '../../components/media-types'
import { Identicon } from '../../components/identicons'
import { walletPreview } from '../../utils/string'
import { SanitiseOBJKT } from '../../utils/sanitise'
import { PATH } from '../../constants'
import styles from './index.module.scss'

const axios = require('axios')

export default class Display extends Component {
  static contextType = HicetnuncContext

  state = {
    wallet: window.location.pathname.split('/')[2],
    alias: walletPreview(window.location.pathname.split('/')[2]),
    render: false,
    balance: 0,
    loading: true,
    results: [],
    objkts: [],
    creations: [],
    collection: [],
    collectionState: false,
    creationsState: true,
  }

  componentWillMount = async () => {
    this.context.setPath(window.location.pathname)

    fetch(`https://api.tzkt.io/v1/accounts/${this.state.wallet}`)
      .then(response => {
        if (response.ok)
          return response.json()
        return Promise.reject(response);
      })
      .then((data) => {
        if (data.alias)
          this.setState({ alias: data.alias })
        if (data.balance)
          this.setState({ balance: (data.balance / 1000000) })
      })
      .catch((error) => {
        console.warn('Something went wrong.', error);
      });

    await axios
      .post(process.env.REACT_APP_TZ, {
        // 3.129.20.231
        tz: this.state.wallet,
      })
      .then(async (res) => {
        const sanitised = SanitiseOBJKT(res.data.result)

        this.setState({
          objkts: sanitised,
          creations: sanitised.filter(
            (e) => this.state.wallet === e.token_info.creators[0]
          ),
          collection: sanitised.filter(
            (e) => this.state.wallet !== e.token_info.creators[0]
          ),
          loading: false,
        })
      })
  }

  creations = () =>
    this.setState({ collectionState: false, creationsState: true })

  collection = () =>
    this.setState({ collectionState: true, creationsState: false })

  render() {
    return (
      <Page>
        <Container>
          <Padding>
            <div className={styles.profile}>
              <Identicon address={this.state.wallet} />

              <div className={styles.info}>
                <Button href={`https://tzkt.io/${this.state.wallet}`}>
                  <Primary>{this.state.alias}</Primary>
                </Button>
                {/* TODO: Move this to API not Context--> this.context.getBalance(addr) */}
                <p>{this.state.balance} - ꜩ</p>
                <p>- ○</p>
              </div>
            </div>
          </Padding>
        </Container>

        <Container>
          <Padding>
            <p>
              <strong>OBJKTs</strong>
            </p>
            <div className={styles.menu}>
              <Button onClick={this.creations}>
                <Primary selected={this.state.creationsState}>
                  creations
                </Primary>
              </Button>

              <Button onClick={this.collection}>
                <Primary selected={this.state.collectionState}>
                  collection
                </Primary>
              </Button>
            </div>
          </Padding>
        </Container>

        {this.state.loading && (
          <Container>
            <Padding>
              <Loading />
            </Padding>
          </Container>
        )}

        {this.state.creationsState && (
          <Container xlarge>
            <div className={styles.list}>
              {this.state.creations.map((nft, i) => {
                const { mimeType, uri } = nft.token_info.formats[0]

                return (
                  <Button
                    key={nft.token_id}
                    to={`${PATH.OBJKT}/${nft.token_id}`}
                  >
                    <div className={styles.container}>
                      {renderMediaType({
                        mimeType,
                        uri: uri.split('//')[1],
                      })}
                      <div className={styles.number}>OBJKT#{nft.token_id}</div>
                    </div>
                  </Button>
                )
              })}
            </div>
          </Container>
        )}

        {this.state.collectionState && (
          <Container xlarge>
            <div className={styles.list}>
              {this.state.collection.map((nft, i) => {
                const { mimeType, uri } = nft.token_info.formats[0]
                return (
                  <Button
                    key={nft.token_id}
                    to={`${PATH.OBJKT}/${nft.token_id}`}
                  >
                    <div className={styles.container}>
                      {renderMediaType({ mimeType, uri: uri.split('//')[1] })}
                      <div className={styles.number}>OBJKT#{nft.token_id}</div>
                    </div>
                  </Button>
                )
              })}
            </div>
          </Container>
        )}
      </Page>
    )
  }
}
