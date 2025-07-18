{ config
, lib
, pkgs
, ...
}:

with lib;

let
  cfg = config.services.dead-earth-project;
in
{
  options.services.dead-earth-project = {
    enable = mkEnableOption "Dead-Earth Project service";
    port = mkOption {
      type = types.port;
      default = 3000;
      description = "Port to run the Dead-Earth Project on";
    };
  };

  config = mkIf cfg.enable {
    systemd.services.dead-earth-project = {
      description = "Dead-Earth Project - Climate Change Simulation";
      wantedBy = [ "multi-user.target" ];
      after = [ "network.target" ];

      serviceConfig = {
        Type = "simple";
        ExecStart = "${pkgs.dead-earth-project}/bin/run-dead-earth-project";
        Restart = "always";
        RestartSec = "10";
        Environment = "PORT=${toString cfg.port}";
        WorkingDirectory = "${pkgs.dead-earth-project}/share/dead-earth-project";
      };
    };
  };
} 