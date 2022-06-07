const download = (vCardString, fileName) => {
  const fileURL = URL.createObjectURL(
    new Blob([vCardString], { type: 'text/vcard;charset=utf-8' })
  );
  let fileLink = document.createElement('a');
  fileLink.href = fileURL;
  fileLink.download = `${fileName}.vcf`;
  document.body.appendChild(fileLink);
  fileLink.click();
};

export default download;
