import React from 'react';
import commonPackageTemplate from './commonPackageTempalte.jsx';

export default require('maco').template(bower, React);

function bower(props) {
  var model = props.model;

  var link = 'http://ferenda.lagen.nu/' + model.name;
  var linkText = model.name;

  return commonPackageTemplate(model, link, linkText);
}
