import React, { Component } from 'react';
import {Provider} from 'react-redux';
import routes from '../routes';
import {ReduxRouter} from 'redux-router';
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {
cyan500, cyan700,
grey100, grey300, grey400, grey500,
white, darkBlack, fullBlack,
} from 'material-ui/styles/colors';
import {fade} from 'material-ui/utils/colorManipulator';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

export default class Root extends Component {

  static propTypes = {
    store: React.PropTypes.object.isRequired
  };

  render () {
    const muiTheme = getMuiTheme({
      spacing: {
        iconSize: 24,
        desktopGutter: 24,
        desktopGutterMore: 32,
        desktopGutterLess: 16,
        desktopGutterMini: 8,
        desktopKeylineIncrement: 64,
        desktopDropDownMenuItemHeight: 32,
        desktopDropDownMenuFontSize: 15,
        desktopDrawerMenuItemHeight: 48,
        desktopSubheaderHeight: 48,
        desktopToolbarHeight: 56,
      },
      fontFamily: 'Roboto, sans-serif',
      palette: {
        primary1Color: '#f5ac4c', //orange
        primary2Color: '#41829c', //blue
        primary3Color: grey400,
        accent1Color: '#47bfbd', //teal
        accent2Color: grey100,
        accent3Color: grey500,
        textColor: darkBlack,
        alternateTextColor: white,
        canvasColor: white,
        borderColor: grey300,
        disabledColor: fade(darkBlack, 0.3),
        pickerHeaderColor: cyan500,
        clockCircleColor: fade(darkBlack, 0.07),
        shadowColor: fullBlack,
      },
    });

    return (
      <div>
        <MuiThemeProvider muiTheme={muiTheme}>
            <Provider store={this.props.store}>
              <div>
                <ReduxRouter>
                  {routes}
                </ReduxRouter>
              </div>
            </Provider>
        </MuiThemeProvider>
      </div>
    );
  }
}
