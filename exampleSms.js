module.exports = ({ headers, data }) => {
  return `${headers.get('subject')}`
}
