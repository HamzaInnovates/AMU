#!/usr/bin/env python3
# .~ Author: @TheFlash2k

import sys
from colorama import Fore, init
from datetime import datetime
import os
from pathlib import Path

init(autoreset=True)

class Color:

    colors = {
        "[GREEN]" : Fore.GREEN,
        "[RESET]" : Fore.RESET,
        "[RED]" : Fore.RED,
        "[BLUE]" : Fore.BLUE,
        "[YELLOW]" : Fore.YELLOW,
        "[WHITE]" : Fore.WHITE,
        "[MAGENTA]" : Fore.MAGENTA,
        "[CYAN]" : Fore.CYAN,
        "[BLACK]" : Fore.BLACK
    }

    @staticmethod
    def colorize(msg : str) -> str:
        for color in Color.colors.items():
            msg = msg.replace(color[0].upper(), color[1])
        return msg

    @staticmethod
    def uncolorize(msg : str) -> str:
        for color in Color.colors.items():
            msg = msg.replace(color[0].upper(), '')
        return msg
    
class LogLevel:
    LOG         = [ "+", "LOG",         "[GREEN]",   sys.stdout ]
    ERROR       = [ "-", "ERROR",       "[RED]",     sys.stderr ]
    INFO        = [ "+", "INFO",        "[BLUE]",   sys.stdout ]
    DEBUG       = [ "*", "DEBUG",       "[BLUE]",    sys.stdout ]
    WARN        = [ "!", "WARN",        "[YELLOW]",  sys.stderr ]
    AUTH        = [ "#", "AUTH",        "[MAGENTA]", sys.stdout ]
    CONNECTIONS = [ ">", "CONNECTIONS", "[CYAN]",    sys.stdout ]

def current_time():
    from datetime import datetime
    return datetime.now().strftime("%m/%d/%y - %H:%M:%S")

class Logger:
    __setup : bool = False
    logs : str = ""

    @staticmethod
    def setup_logs(
        logs : str
    ):
        
        '''
        Sets up the log file for the logger class.
        '''

        if Logger.__setup == True:
            return

        dirs = '/'.join(logs.split('/')[:-1])
        log_file = logs.split('/')[-1]

        Path(dirs).mkdir(parents=True, exist_ok=True)

        if not log_file.endswith('.log'):
            log_file += '.log'

        if '%' in log_file:
            beg, end = log_file.find('%'), log_file.rfind('%')
            fmt = log_file[beg : end + 2]
            log_file = log_file[:beg] + datetime.now().strftime(fmt) + log_file[end + 2:]
        Logger.logs = os.path.join(dirs, log_file)
        
    @staticmethod
    def __log__(
        msg : str,
        level : LogLevel = LogLevel.LOG,
        only_print : bool = False,
        *args,
        **kwargs
    ):
        if not Logger.__setup:
            Logger.setup_logs('logs/%m-%d-%y.log')
            Logger.__setup = True

        msg = f"[[CYAN]{current_time()}[RESET]] [{level[2]}{level[1]}[RESET]] {msg}"
        clean = Color.uncolorize(msg)
        msg = Color.colorize(msg)

        if not only_print:
            with open(Logger.logs, 'a') as f:
                f.write(f"{clean}\n")
        
        kwargs['file'] = level[-1]
        print(msg, *args, **kwargs)

    @staticmethod
    def stdout(msg, *args, **kwargs):
        Logger.__log__(msg, level=LogLevel.LOG, only_print=True, *args, **kwargs)

    @staticmethod
    def stderr(msg, *args, **kwargs):    
        kwargs['file'] = sys.stderr
        Logger.__log__(msg, level=LogLevel.ERROR, only_print=True, *args, **kwargs)

    @staticmethod
    def log(msg, *args, **kwargs):
        Logger.__log__(msg, level=LogLevel.LOG, *args, **kwargs)

    @staticmethod
    def error(msg : str, *args, **kwargs):
        Logger.__log__(msg, LogLevel.ERROR, *args, **kwargs)

    @staticmethod
    def info(msg : str, *args, **kwargs):
        Logger.__log__(msg, LogLevel.INFO, *args, **kwargs)

    @staticmethod
    def debug(msg : str, *args, **kwargs):
        Logger.__log__(msg, LogLevel.DEBUG, *args, **kwargs)

    @staticmethod
    def warn(msg : str, *args, **kwargs):
        Logger.__log__(msg, LogLevel.WARN, *args, **kwargs)

    @staticmethod
    def auth(msg : str, *args, **kwargs):
        Logger.__log__(msg, LogLevel.AUTH, *args, **kwargs)

    @staticmethod
    def connections(msg : str, *args, **kwargs):
        Logger.__log__(msg, LogLevel.CONNECTIONS, *args, **kwargs)