{ lib
, stdenv
, nodejs
, nodePackages
, fetchFromGitHub
}:

let
  pname = "dead-earth-project";
  version = "0.1.0";
in
stdenv.mkDerivation {
  inherit pname version;

  src = ./.;

  nativeBuildInputs = [
    nodejs
    nodePackages.npm
  ];

  installPhase = ''
    runHook preInstall

    npm install
    npm run build

    mkdir -p $out/bin
    mkdir -p $out/share/${pname}

    cp -r .next $out/share/${pname}/
    cp -r public $out/share/${pname}/
    cp package.json $out/share/${pname}/

    cat > $out/bin/dead-earth-project <<EOF
    #!${stdenv.shell}
    cd $out/share/${pname}
    exec ${nodejs}/bin/node .next/standalone/server.js
    EOF

    chmod +x $out/bin/dead-earth-project

    runHook postInstall
  };

  meta = with lib; {
    description = "Interactive 3D globe simulation showing climate change effects";
    homepage = "https://github.com/openxai/global-accelerator-2025";
    license = licenses.mit;
    platforms = platforms.all;
  };
} 