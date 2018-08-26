function pad(n, width, z = 0) {
  return (String(z).repeat(width) + String(n)).slice(String(n).length)
}

module.exports = {
  address(addressLiteral) {
    const strAddress = `${addressLiteral}`
    const paddedAddress = pad(strAddress, 40)
    return `0x${paddedAddress}`
  }
}
